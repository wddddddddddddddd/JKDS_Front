import { createRouter, createWebHistory } from 'vue-router'
import Search from '../views/Search.vue'
import NotFound from '../views/NotFound.vue'
import FinancialDashboard from '../views/FinancialDashboard.vue'
import Login from '../views/Login.vue'
import aiParseDev from "@/views/aiParseDev.vue";
import ReportDetail from '@/views/ReportDetail.vue'
import PdfPreview from '@/views/PdfPreview.vue'
import TextAnalyzer from '@/components/TextAnalyzer.vue'
import ChartConverter from '@/components/ChartConverter.vue'
import demo from '@/views/demo.vue'
import streamChat from '@/views/streamChat.vue'
import CardsSelected from '@/views/CardsSelected.vue';
import ReportResult from '@/views/ReportResult.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/CardsSelected', name: 'CardsSelected', component: CardsSelected },
    {
      path: '/ReportResult',
      name: 'ReportResult',
      component: ReportResult
    },
    {
      path: '/streamChat',
      name: 'streamChat',
      component: streamChat,
    },
    {
      path: '/demo',
      name: 'demo',
      component: demo,
    },
    {
      path: '/',
      name: 'Search',
      component: Search,
    },
    {
      path:'/index',
      component: NotFound
    },
    {
      path: '/FinancialDashBoard',
      name: 'FinancialDashBoard',
      component: FinancialDashboard
    },
    {
      path: '/Login',
      component: Login
    },
    {
      path:'/aiParse',
      component:aiParseDev
    },
    {
      path: '/ReportDetail',
      name: 'ReportDetail',
      component:ReportDetail,
      props: true,
      redirect: { name: 'TextAnalyzer' },  // 默认进入AI解析页面
      children: [
        {
          path: '/ReportDetail/TextAnalyzer',
          name: 'TextAnalyzer',
          component: TextAnalyzer
        },
        {
          path: '/ReportDetail/ChartConverter',
          name: 'ChartConverter',
          component: ChartConverter
        }
      ]
    },
    {
      path: '/PdfPreview',
      component: PdfPreview
    },
  ],
})

export default router
