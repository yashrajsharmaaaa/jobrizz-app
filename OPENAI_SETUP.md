# 🤖 OpenAI API Configuration Guide

## 🔐 Recommended Key Permissions

### Permission Type: **RESTRICTED** ✅

### Required Scopes:
- ✅ **Chat Completions** (Read & Write)
- ✅ **Models** (Read only)

### Models to Enable:
- ✅ `gpt-3.5-turbo` (Cost-effective, good quality)
- ✅ `gpt-4` (Optional - Higher quality, more expensive)

### Permissions to EXCLUDE:
- ❌ Fine-tuning
- ❌ Files
- ❌ Images  
- ❌ Audio
- ❌ Assistants
- ❌ Batch

## 💰 Cost Management

### Recommended Budget Limits:
- **Development**: $10/month
- **Production**: $50-100/month (depending on usage)

### Usage Estimates:
- **Resume Analysis**: ~$0.01-0.05 per analysis
- **Job Matching**: ~$0.02-0.08 per match
- **Corrections**: ~$0.01-0.03 per correction

### Rate Limits:
- **Requests per minute**: 60 (default)
- **Tokens per minute**: 40,000 (default)

## 🔒 Security Best Practices

### Key Management:
1. **Separate Keys**: Use different keys for dev/staging/prod
2. **Regular Rotation**: Rotate keys every 90 days
3. **Monitor Usage**: Set up usage alerts
4. **Restrict by IP**: If possible, limit to your server IPs

### Environment Variables:
```env
# Production
OPENAI_API_KEY="sk-your-restricted-production-key"

# Development  
OPENAI_API_KEY="sk-your-restricted-development-key"
```

## 📊 Monitoring & Alerts

### Set up alerts for:
- **High usage** (80% of monthly budget)
- **Unusual patterns** (sudden spikes)
- **Rate limit hits**
- **Failed requests**

## 🚨 Emergency Procedures

### If Key is Compromised:
1. **Immediately revoke** the key in OpenAI dashboard
2. **Generate new key** with same restrictions
3. **Update environment variables**
4. **Monitor usage** for any unauthorized activity
5. **Review logs** for suspicious patterns

## 🔧 Implementation Notes

Your JobRizz app uses OpenAI for:
1. **Resume Analysis** - Analyzing resume content for improvements
2. **ATS Scoring** - Calculating compatibility scores
3. **Job Matching** - Comparing resumes with job descriptions
4. **Content Correction** - Grammar and formatting suggestions

All these features only need **Chat Completions** API access.

## ✅ Setup Checklist

- [ ] Create restricted OpenAI API key
- [ ] Enable only Chat Completions and Models
- [ ] Set monthly budget limit ($50 recommended)
- [ ] Add key to backend/.env.production
- [ ] Test key with a simple API call
- [ ] Set up usage monitoring
- [ ] Document key rotation schedule

## 🧪 Test Your Key

After setup, test with:
```bash
curl https://api.openai.com/v1/chat/completions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_API_KEY" \
  -d '{
    "model": "gpt-3.5-turbo",
    "messages": [{"role": "user", "content": "Test message"}],
    "max_tokens": 10
  }'
```

This should return a successful response if configured correctly.