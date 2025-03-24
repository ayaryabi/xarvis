"use client"

import { Button } from "@/components/ui/button/index"
import { Container } from "@/components/ui/container/container"
import { Badge } from "@/components/ui/badge"
import { Heading } from "@/components/ui/heading"
import { GradientBackground } from "@/components/common/gradients/background"
import { VersionTag } from "@/components/features/version-tag"
import { MacWindow } from "@/components/mac-window"
import { SlackInterface } from "@/components/slack-interface"
import { Download } from "lucide-react"

export function HeroSection() {
  return (
    <section className="pt-32 pb-20 relative overflow-hidden">
      <GradientBackground variant="hero" />

      <Container className="relative z-10">
        <div className="max-w-4xl mx-auto text-center mb-12">
          <Badge variant="primary" className="mb-6">
            Introducing XARVIS for Slack
          </Badge>
          
          <Heading as="h1" size="xl" gradient className="mb-6">
            The most intelligent media buyer
            <br />
            right in your workflow.
          </Heading>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Optimize your ad campaigns with AI-powered insights and recommendations without ever leaving Slack.
            Fast, intelligent, and reliable.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Button 
              variant="white"
              className="bg-gradient-to-r from-[#ff6363] to-[#ff3939] hover:from-[#ff7373] hover:to-[#ff4949] text-white rounded-xl shadow-lg shadow-[#ff6363]/20 border border-[#ff6363]/20"
              size="xl"
            >
              <Download className="mr-2 h-5 w-5" />
              Install on Slack
            </Button>
            
            <Button
              variant="outline"
              size="xl"
              className="rounded-xl"
            >
              Watch Demo
            </Button>
          </div>
        </div>

        <div className="relative mx-auto max-w-5xl">
          <div className="absolute -inset-0.5 bg-gradient-to-r from-[#ff6363] to-[#ff3939] rounded-2xl blur opacity-30"></div>
          
          <MacWindow>
            <SlackInterface />
          </MacWindow>

          <VersionTag version="v1.0.2" text="Install via Slack App Directory" />
        </div>
      </Container>
    </section>
  )
} 