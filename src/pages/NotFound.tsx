import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
    HomeIcon,
    MagnifyingGlassIcon,
    ArrowLeftIcon
} from '@heroicons/react/24/outline';
import { ROUTES } from '../constants';

const NotFoundPage: React.FC = () => {
    const navigate = useNavigate();

    return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
            <div className="max-w-lg w-full text-center">
                {/* 404 Illustration */}
                <div className="mb-8">
                    <div className="text-9xl font-bold text-gray-200 mb-4">404</div>
                    <div className="w-24 h-24 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
                        <MagnifyingGlassIcon className="w-12 h-12 text-blue-600" />
                    </div>
                </div>

                {/* Content */}
                <h1 className="text-3xl font-bold text-gray-900 mb-4">
                    Page Not Found
                </h1>
                <p className="text-gray-600 mb-8 leading-relaxed">
                    Sorry, we couldn't find the page you're looking for.
                    It might have been moved, deleted, or you entered the wrong URL.
                </p>

                {/* Action Buttons */}
                <div className="space-y-4">
                    <Link
                        to={ROUTES.HOME}
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
                    >
                        <HomeIcon className="w-5 h-5 mr-2" />
                        Go to Homepage
                    </Link>

                    <button
                        onClick={() => navigate(-1)}
                        className="inline-flex items-center justify-center w-full px-6 py-3 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium"
                    >
                        <ArrowLeftIcon className="w-5 h-5 mr-2" />
                        Go Back
                    </button>
                </div>

                {/* Quick Links */}
                <div className="mt-12 pt-8 border-t border-gray-200">
                    <h3 className="text-sm font-medium text-gray-900 mb-4">
                        Popular Pages
                    </h3>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                        <Link
                            to={ROUTES.ANALYSIS}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Resume Analysis
                        </Link>
                        <Link
                            to={ROUTES.JOB_MATCHING}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Job Matching
                        </Link>
                        <Link
                            to={ROUTES.DASHBOARD}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Dashboard
                        </Link>
                        <Link
                            to={ROUTES.LOGIN}
                            className="text-blue-600 hover:text-blue-800 hover:underline"
                        >
                            Login
                        </Link>
                    </div>
                </div>

                {/* Help Text */}
                <div className="mt-8">
                    <p className="text-xs text-gray-500">
                        Still having trouble?{' '}
                        <a
                            href="mailto:support@jobrizz.com"
                            className="text-blue-600 hover:text-blue-800 underline"
                        >
                            Contact support
                        </a>
                    </p>
                </div>
            </div>
        </div>
    );
};

export default NotFoundPage;