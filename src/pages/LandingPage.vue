<template>
  <div class="min-h-screen bg-white">
    <!-- Navigation -->
    <nav class="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-lg border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex justify-between items-center h-16">
          <!-- Logo -->
          <div class="flex items-center gap-2">
            <div class="p-2 bg-primary-100 rounded-lg">
              <ShieldCheckIcon class="h-6 w-6 text-primary-600" />
            </div>
            <span class="text-xl font-bold text-gray-900">ClaimMatrix</span>
          </div>

          <!-- Desktop Navigation -->
          <div class="hidden md:flex items-center gap-8">
            <a
              v-for="item in navItems"
              :key="item.name"
              :href="item.href"
              class="text-sm font-medium text-gray-600 hover:text-primary-600 transition-colors"
            >
              {{ item.name }}
            </a>
          </div>

          <!-- CTA Buttons -->
          <div class="flex items-center gap-3">
            <router-link
              to="/login"
              class="text-sm font-medium text-gray-700 hover:text-primary-600 transition-colors"
            >
              Sign in
            </router-link>
            <router-link
              to="/register"
              class="px-4 py-2 bg-primary-600 text-white text-sm font-medium rounded-lg hover:bg-primary-700 transition-colors"
            >
              Get Started
            </router-link>
          </div>
        </div>
      </div>
    </nav>

    <!-- Hero Section -->
    <section class="pt-32 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-b from-primary-50 to-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto">
          <div class="inline-flex items-center gap-2 px-4 py-2 bg-primary-100 rounded-full text-primary-700 text-sm font-medium mb-6">
            <SparklesIcon class="h-4 w-4" />
            AI-Powered Fraud Detection
          </div>
          <h1 class="text-5xl md:text-6xl font-bold text-gray-900 mb-6 leading-tight">
            Detect Healthcare Fraud
            <span class="text-primary-600">Before It Costs You</span>
          </h1>
          <p class="text-xl text-gray-600 mb-8 leading-relaxed">
            Advanced ML-powered audit platform that identifies fraudulent claims, reduces losses,
            and protects your healthcare organization with intelligent automation.
          </p>
          <div class="flex flex-col sm:flex-row gap-4 justify-center">
            <router-link
              to="/register"
              class="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
            >
              Start Free Trial
            </router-link>
            <a
              href="#demo"
              class="px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
            >
              Watch Demo
            </a>
          </div>

          <!-- Stats -->
          <div class="grid grid-cols-3 gap-8 mt-16 pt-16 border-t border-gray-200">
            <div v-for="stat in stats" :key="stat.label" class="text-center">
              <div class="text-4xl font-bold text-primary-600 mb-2">{{ stat.value }}</div>
              <div class="text-sm text-gray-600">{{ stat.label }}</div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section id="features" class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">
            Everything you need to combat fraud
          </h2>
          <p class="text-xl text-gray-600">
            Powerful features designed to protect your organization and streamline audit processes
          </p>
        </div>

        <div class="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          <div
            v-for="feature in features"
            :key="feature.title"
            class="p-6 rounded-xl border border-gray-200 hover:border-primary-200 hover:shadow-lg transition-all"
          >
            <div class="inline-flex p-3 bg-primary-50 rounded-lg mb-4">
              <component :is="feature.icon" class="h-6 w-6 text-primary-600" />
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ feature.title }}</h3>
            <p class="text-gray-600">{{ feature.description }}</p>
          </div>
        </div>
      </div>
    </section>

    <!-- How It Works -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
      <div class="max-w-7xl mx-auto">
        <div class="text-center max-w-3xl mx-auto mb-16">
          <h2 class="text-4xl font-bold text-gray-900 mb-4">How it works</h2>
          <p class="text-xl text-gray-600">
            Get started in minutes with our simple three-step process
          </p>
        </div>

        <div class="grid md:grid-cols-3 gap-8">
          <div
            v-for="(step, index) in steps"
            :key="step.title"
            class="relative text-center"
          >
            <div class="inline-flex items-center justify-center w-16 h-16 bg-primary-100 text-primary-600 rounded-full text-2xl font-bold mb-4">
              {{ index + 1 }}
            </div>
            <h3 class="text-xl font-semibold text-gray-900 mb-2">{{ step.title }}</h3>
            <p class="text-gray-600">{{ step.description }}</p>

            <!-- Arrow -->
            <div
              v-if="index < steps.length - 1"
              class="hidden md:block absolute top-8 -right-4 text-gray-300"
            >
              <ArrowRightIcon class="h-8 w-8" />
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- Benefits Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-primary-600">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-2 gap-12 items-center">
          <div>
            <h2 class="text-4xl font-bold text-white mb-6">
              Reduce fraud losses by up to 95%
            </h2>
            <p class="text-xl text-primary-100 mb-8">
              Our ML-powered platform analyzes millions of claims in seconds, identifying
              patterns and anomalies that human auditors might miss.
            </p>
            <ul class="space-y-4">
              <li
                v-for="benefit in benefits"
                :key="benefit"
                class="flex items-start gap-3 text-white"
              >
                <CheckCircleIcon class="h-6 w-6 text-primary-200 flex-shrink-0 mt-0.5" />
                <span class="text-lg">{{ benefit }}</span>
              </li>
            </ul>
          </div>
          <div class="relative">
            <div class="bg-white/10 backdrop-blur-lg rounded-2xl p-8 border border-white/20">
              <div class="grid grid-cols-2 gap-6">
                <div
                  v-for="metric in metrics"
                  :key="metric.label"
                  class="text-center p-4 bg-white/10 rounded-lg"
                >
                  <div class="text-3xl font-bold text-white mb-1">{{ metric.value }}</div>
                  <div class="text-sm text-primary-100">{{ metric.label }}</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>

    <!-- CTA Section -->
    <section class="py-20 px-4 sm:px-6 lg:px-8 bg-white">
      <div class="max-w-4xl mx-auto text-center">
        <h2 class="text-4xl font-bold text-gray-900 mb-4">
          Ready to protect your organization?
        </h2>
        <p class="text-xl text-gray-600 mb-8">
          Join hundreds of healthcare organizations already using ClaimMatrix
        </p>
        <div class="flex flex-col sm:flex-row gap-4 justify-center">
          <router-link
            to="/register"
            class="px-8 py-4 bg-primary-600 text-white text-lg font-semibold rounded-lg hover:bg-primary-700 transition-colors shadow-lg shadow-primary-600/25"
          >
            Start Free Trial
          </router-link>
          <a
            href="mailto:sales@claimmatrix.com"
            class="px-8 py-4 bg-white text-gray-900 text-lg font-semibold rounded-lg hover:bg-gray-50 transition-colors border-2 border-gray-200"
          >
            Contact Sales
          </a>
        </div>
      </div>
    </section>

    <!-- Footer -->
    <footer class="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
      <div class="max-w-7xl mx-auto">
        <div class="grid md:grid-cols-4 gap-8 mb-8">
          <!-- Brand -->
          <div class="md:col-span-1">
            <div class="flex items-center gap-2 mb-4">
              <div class="p-2 bg-primary-600 rounded-lg">
                <ShieldCheckIcon class="h-5 w-5 text-white" />
              </div>
              <span class="text-lg font-bold text-white">ClaimMatrix</span>
            </div>
            <p class="text-sm text-gray-400">
              Advanced healthcare fraud detection powered by machine learning.
            </p>
          </div>

          <!-- Links -->
          <div v-for="column in footerLinks" :key="column.title">
            <h3 class="text-white font-semibold mb-4">{{ column.title }}</h3>
            <ul class="space-y-2">
              <li v-for="link in column.links" :key="link.name">
                <a :href="link.href" class="text-sm hover:text-white transition-colors">
                  {{ link.name }}
                </a>
              </li>
            </ul>
          </div>
        </div>

        <!-- Bottom -->
        <div class="pt-8 border-t border-gray-800 flex flex-col md:flex-row justify-between items-center gap-4">
          <p class="text-sm text-gray-400">
            © {{ currentYear }} ClaimMatrix. All rights reserved.
          </p>
          <div class="flex gap-6">
            <a href="#" class="text-sm hover:text-white transition-colors">Privacy Policy</a>
            <a href="#" class="text-sm hover:text-white transition-colors">Terms of Service</a>
            <a href="#" class="text-sm hover:text-white transition-colors">Contact</a>
          </div>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import {
  ShieldCheckIcon,
  SparklesIcon,
  ChartBarIcon,
  ClockIcon,
  CpuChipIcon,
  DocumentTextIcon,
  FlagIcon,
  ArrowUpTrayIcon,
  CheckCircleIcon,
  ArrowRightIcon
} from '@heroicons/vue/24/outline'

const navItems = [
  { name: 'Features', href: '#features' },
  { name: 'How it Works', href: '#how-it-works' },
  { name: 'Pricing', href: '#pricing' },
  { name: 'About', href: '#about' }
]

const stats = [
  { value: '95%', label: 'Fraud Reduction' },
  { value: '2.5h', label: 'Avg Processing Time' },
  { value: '500K+', label: 'Claims Analyzed' }
]

const features = [
  {
    title: 'ML-Powered Detection',
    description: 'Advanced machine learning algorithms identify anomalies and fraud patterns with 95% accuracy.',
    icon: CpuChipIcon
  },
  {
    title: 'Real-Time Auditing',
    description: 'Audit claims in real-time as they come in, catching fraud before it costs you.',
    icon: ClockIcon
  },
  {
    title: 'Bulk CSV Upload',
    description: 'Upload thousands of claims at once with our CSV import feature.',
    icon: ArrowUpTrayIcon
  },
  {
    title: 'Risk Scoring',
    description: 'Every claim gets a suspicion score from 0-1, prioritizing high-risk cases.',
    icon: FlagIcon
  },
  {
    title: 'Comprehensive Analytics',
    description: 'Beautiful dashboards with insights on fraud trends, providers, and members.',
    icon: ChartBarIcon
  },
  {
    title: 'Audit Trail',
    description: 'Complete audit history for compliance and accountability.',
    icon: DocumentTextIcon
  }
]

const steps = [
  {
    title: 'Upload Claims',
    description: 'Import your claims data via CSV or API integration in seconds.'
  },
  {
    title: 'AI Analysis',
    description: 'Our ML engine analyzes patterns and flags suspicious activities.'
  },
  {
    title: 'Take Action',
    description: 'Review flagged claims and take action based on our recommendations.'
  }
]

const benefits = [
  'Reduce manual audit time by 80%',
  'Identify fraud patterns invisible to humans',
  'Automated compliance reporting',
  'Seamless integration with existing systems',
  'Enterprise-grade security and privacy'
]

const metrics = [
  { value: '99.9%', label: 'Uptime' },
  { value: '<2s', label: 'Response Time' },
  { value: '24/7', label: 'Support' },
  { value: 'SOC 2', label: 'Certified' }
]

const footerLinks = [
  {
    title: 'Product',
    links: [
      { name: 'Features', href: '#features' },
      { name: 'Pricing', href: '#pricing' },
      { name: 'Security', href: '#security' },
      { name: 'Integrations', href: '#integrations' }
    ]
  },
  {
    title: 'Company',
    links: [
      { name: 'About', href: '#about' },
      { name: 'Blog', href: '#blog' },
      { name: 'Careers', href: '#careers' },
      { name: 'Contact', href: '#contact' }
    ]
  },
  {
    title: 'Resources',
    links: [
      { name: 'Documentation', href: '#docs' },
      { name: 'API Reference', href: '#api' },
      { name: 'Support', href: '#support' },
      { name: 'Status', href: '#status' }
    ]
  }
]

const currentYear = computed(() => new Date().getFullYear())
</script>
