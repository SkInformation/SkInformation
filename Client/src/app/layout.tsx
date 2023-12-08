import type {Metadata} from 'next'
import {Inter} from 'next/font/google'
import './globals.css'
import { Logo } from "@/app/components/Logo";
import Container from '@mui/material/Container';
import { SurveyProvider } from "@/app/context/SurveyContext";
import styles from "@/app/page.module.css";

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'SkInformation',
  description: '',
}

export default function RootLayout(props: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <SurveyProvider>
            {props.children}
        </SurveyProvider>
      </body>
    </html>
  )
}
