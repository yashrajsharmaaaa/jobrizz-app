import { PrismaClient } from '@prisma/client';
import { logger } from '../utils/logger.js';

const prisma = new PrismaClient();

async function main() {
  logger.info('🌱 Starting database seeding...');

  try {
    // Create default templates
    const templates = [
      {
        name: 'Modern Professional',
        description: 'Clean and modern template suitable for most industries',
        styles: {
          fontFamily: 'Inter, sans-serif',
          fontSize: '11pt',
          lineHeight: 1.4,
          colors: {
            primary: '#2563eb',
            text: '#1f2937',
            accent: '#6b7280'
          },
          spacing: {
            section: '16px',
            item: '8px'
          }
        }
      },
      {
        name: 'Creative Designer',
        description: 'Stylish template for creative professionals',
        styles: {
          fontFamily: 'Poppins, sans-serif',
          fontSize: '10pt',
          lineHeight: 1.5,
          colors: {
            primary: '#7c3aed',
            text: '#374151',
            accent: '#a855f7'
          },
          spacing: {
            section: '20px',
            item: '10px'
          }
        }
      },
      {
        name: 'Executive Classic',
        description: 'Traditional template for executive positions',
        styles: {
          fontFamily: 'Times New Roman, serif',
          fontSize: '12pt',
          lineHeight: 1.3,
          colors: {
            primary: '#1f2937',
            text: '#374151',
            accent: '#6b7280'
          },
          spacing: {
            section: '14px',
            item: '6px'
          }
        }
      }
    ];

    for (const template of templates) {
      await prisma.template.upsert({
        where: { name: template.name },
        update: template,
        create: template,
      });
      logger.info(`✅ Created/updated template: ${template.name}`);
    }

    // Create a test user (for development only)
    if (process.env.NODE_ENV === 'development') {
      const testUser = await prisma.user.upsert({
        where: { email: 'test@jobrizz.com' },
        update: {},
        create: {
          email: 'test@jobrizz.com',
          name: 'Test User',
          password: '$2a$12$LQv3c1yqBWVHxkd0LHAkCOYz6TtxMQJqhN8/LewdBPj/RK.s5uO8G', // password: 'password123'
        },
      });
      logger.info(`✅ Created/updated test user: ${testUser.email}`);

      // Create a sample resume for the test user
      const sampleResume = await prisma.resume.upsert({
        where: { id: 'sample-resume-id' },
        update: {},
        create: {
          id: 'sample-resume-id',
          userId: testUser.id,
          title: 'Software Developer Resume',
          template: {
            id: 'modern-professional',
            name: 'Modern Professional'
          },
          metadata: {
            version: 1,
            wordCount: 350,
            lastModified: new Date().toISOString()
          },
          sections: {
            create: [
              {
                type: 'personal',
                content: {
                  name: 'John Doe',
                  email: 'john.doe@example.com',
                  phone: '+1 (555) 123-4567',
                  location: 'San Francisco, CA',
                  website: 'https://johndoe.dev',
                  linkedin: 'https://linkedin.com/in/johndoe'
                },
                order: 1
              },
              {
                type: 'experience',
                content: {
                  items: [
                    {
                      title: 'Senior Software Developer',
                      company: 'Tech Corp',
                      location: 'San Francisco, CA',
                      startDate: '2022-01',
                      endDate: 'Present',
                      description: 'Led development of scalable web applications using React and Node.js. Improved application performance by 40% through optimization techniques.'
                    },
                    {
                      title: 'Software Developer',
                      company: 'StartupXYZ',
                      location: 'San Francisco, CA',
                      startDate: '2020-06',
                      endDate: '2021-12',
                      description: 'Developed full-stack applications using modern JavaScript frameworks. Collaborated with cross-functional teams to deliver high-quality software solutions.'
                    }
                  ]
                },
                order: 2
              },
              {
                type: 'education',
                content: {
                  items: [
                    {
                      degree: 'Bachelor of Science in Computer Science',
                      school: 'University of California, Berkeley',
                      location: 'Berkeley, CA',
                      startDate: '2016-09',
                      endDate: '2020-05',
                      gpa: '3.8'
                    }
                  ]
                },
                order: 3
              },
              {
                type: 'skills',
                content: {
                  categories: [
                    {
                      name: 'Programming Languages',
                      skills: ['JavaScript', 'TypeScript', 'Python', 'Java']
                    },
                    {
                      name: 'Frameworks & Libraries',
                      skills: ['React', 'Node.js', 'Express', 'Next.js']
                    },
                    {
                      name: 'Tools & Technologies',
                      skills: ['Git', 'Docker', 'AWS', 'PostgreSQL']
                    }
                  ]
                },
                order: 4
              }
            ]
          }
        },
        include: {
          sections: true
        }
      });
      logger.info(`✅ Created/updated sample resume: ${sampleResume.title}`);
    }

    logger.info('🎉 Database seeding completed successfully!');
  } catch (error) {
    logger.error('❌ Error during database seeding:', error);
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main()
  .catch((e) => {
    logger.error('Seeding failed:', e);
    process.exit(1);
  });