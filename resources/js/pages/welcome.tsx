import { type SharedData } from '@/types';
import { Head, Link, usePage } from '@inertiajs/react';

export default function Welcome() {
    const { auth } = usePage<SharedData>().props;

    return (
        <>
            <Head title="BookEase - Professional Appointment Booking">
                <link rel="preconnect" href="https://fonts.bunny.net" />
                <link href="https://fonts.bunny.net/css?family=instrument-sans:400,500,600" rel="stylesheet" />
            </Head>
            <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
                {/* Navigation */}
                <header className="w-full px-6 py-4">
                    <nav className="flex items-center justify-between max-w-7xl mx-auto">
                        <div className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                                <span className="text-white font-bold text-sm">📅</span>
                            </div>
                            <span className="text-xl font-bold text-gray-900 dark:text-white">BookEase</span>
                        </div>
                        <div className="flex items-center space-x-4">
                            {auth.user ? (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                >
                                    Dashboard
                                </Link>
                            ) : (
                                <>
                                    <Link
                                        href={route('login')}
                                        className="text-gray-700 dark:text-gray-300 hover:text-blue-600 px-4 py-2 font-medium transition-colors"
                                    >
                                        Log in
                                    </Link>
                                    <Link
                                        href={route('register')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg font-medium transition-colors"
                                    >
                                        Get Started
                                    </Link>
                                </>
                            )}
                        </div>
                    </nav>
                </header>

                {/* Hero Section */}
                <main className="px-6 py-12">
                    <div className="max-w-7xl mx-auto">
                        {/* Hero */}
                        <div className="text-center mb-16">
                            <h1 className="text-5xl font-bold text-gray-900 dark:text-white mb-6">
                                📅 Professional Appointment Booking
                                <span className="block text-blue-600">Made Simple</span>
                            </h1>
                            <p className="text-xl text-gray-600 dark:text-gray-300 mb-8 max-w-3xl mx-auto">
                                Streamline your business with our comprehensive booking platform. Manage services, 
                                schedule appointments, and process payments all in one place.
                            </p>
                            <div className="flex flex-col sm:flex-row gap-4 justify-center">
                                {!auth.user && (
                                    <>
                                        <Link
                                            href={route('register')}
                                            className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                        >
                                            Start Free Trial
                                        </Link>
                                        <Link
                                            href={route('login')}
                                            className="border-2 border-blue-600 text-blue-600 hover:bg-blue-600 hover:text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                        >
                                            Book Appointment
                                        </Link>
                                    </>
                                )}
                                {auth.user && (
                                    <Link
                                        href={route('dashboard')}
                                        className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-4 rounded-lg font-semibold text-lg transition-colors"
                                    >
                                        Go to Dashboard
                                    </Link>
                                )}
                            </div>
                        </div>

                        {/* Features Grid */}
                        <div className="grid md:grid-cols-3 gap-8 mb-16">
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-2xl">👥</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Multi-Role Management</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Support for Admin, Agent, and Client roles with dedicated dashboards and permissions.
                                </p>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-2xl">💳</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Stripe Integration</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Secure payment processing with individual Stripe accounts for each agent.
                                </p>
                            </div>
                            
                            <div className="bg-white dark:bg-gray-800 p-8 rounded-xl shadow-lg">
                                <div className="w-12 h-12 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center mb-6">
                                    <span className="text-2xl">📊</span>
                                </div>
                                <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Smart Scheduling</h3>
                                <p className="text-gray-600 dark:text-gray-300">
                                    Real-time availability tracking with calendar integration and conflict prevention.
                                </p>
                            </div>
                        </div>

                        {/* User Roles Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-center mb-12 text-gray-900 dark:text-white">
                                🎯 Built for Every Role
                            </h2>
                            <div className="grid md:grid-cols-3 gap-8">
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-red-100 dark:bg-red-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl">🔧</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Admin Dashboard</h3>
                                    <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-left">
                                        <li>✅ Manage all services & agents</li>
                                        <li>✅ Configure Stripe payments</li>
                                        <li>✅ View comprehensive analytics</li>
                                        <li>✅ Monitor all bookings</li>
                                    </ul>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-blue-100 dark:bg-blue-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl">💼</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Agent Portal</h3>
                                    <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-left">
                                        <li>✅ Manage personal schedule</li>
                                        <li>✅ Set availability & blocked times</li>
                                        <li>✅ Direct Stripe integration</li>
                                        <li>✅ View appointments & earnings</li>
                                    </ul>
                                </div>
                                
                                <div className="text-center">
                                    <div className="w-20 h-20 bg-green-100 dark:bg-green-900 rounded-full flex items-center justify-center mx-auto mb-6">
                                        <span className="text-3xl">👤</span>
                                    </div>
                                    <h3 className="text-xl font-semibold mb-4 text-gray-900 dark:text-white">Client Experience</h3>
                                    <ul className="text-gray-600 dark:text-gray-300 space-y-2 text-left">
                                        <li>✅ Browse available services</li>
                                        <li>✅ Select preferred agents</li>
                                        <li>✅ Interactive calendar booking</li>
                                        <li>✅ Secure payment processing</li>
                                    </ul>
                                </div>
                            </div>
                        </div>

                        {/* Screenshot/Demo Section */}
                        <div className="mb-16">
                            <h2 className="text-3xl font-bold text-center mb-8 text-gray-900 dark:text-white">
                                📱 Modern Interface
                            </h2>
                            <div className="bg-white dark:bg-gray-800 rounded-xl shadow-2xl p-8 max-w-4xl mx-auto">
                                <div className="grid md:grid-cols-2 gap-8">
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                        <div className="h-32 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                                            <span className="text-4xl">📅</span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-2/3"></div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-5/6"></div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4"></div>
                                        <div className="h-32 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                                            <span className="text-4xl">💳</span>
                                        </div>
                                        <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                                    </div>
                                </div>
                                <p className="text-center mt-6 text-gray-600 dark:text-gray-300">
                                    Clean, intuitive interface designed for all user types
                                </p>
                            </div>
                        </div>

                        {/* CTA Section */}
                        <div className="text-center bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl p-12 text-white">
                            <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Business?</h2>
                            <p className="text-xl mb-8 opacity-90">
                                Join thousands of businesses streamlining their appointment booking process.
                            </p>
                            {!auth.user && (
                                <Link
                                    href={route('register')}
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
                                >
                                    Get Started Free Today
                                </Link>
                            )}
                            {auth.user && (
                                <Link
                                    href={route('dashboard')}
                                    className="bg-white text-blue-600 hover:bg-gray-100 px-8 py-4 rounded-lg font-semibold text-lg transition-colors inline-block"
                                >
                                    Access Your Dashboard
                                </Link>
                            )}
                        </div>
                    </div>
                </main>

                {/* Footer */}
                <footer className="border-t border-gray-200 dark:border-gray-700 py-8 px-6 mt-12">
                    <div className="max-w-7xl mx-auto text-center text-gray-600 dark:text-gray-400">
                        <p>
                            Built with ❤️ by{' '}
                            <a 
                                href="https://app.build" 
                                target="_blank" 
                                className="font-medium text-blue-600 hover:underline"
                            >
                                app.build
                            </a>
                        </p>
                    </div>
                </footer>
            </div>
        </>
    );
}