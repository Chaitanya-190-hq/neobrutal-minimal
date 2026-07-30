import { Button } from "@/components/ui/button";
import { ArrowRight, MessageCircle, Zap, Shield, Sparkles } from "lucide-react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

const stagger = {
  animate: {
    transition: {
      staggerChildren: 0.08,
    },
  },
};

const fadeUp = {
  initial: { opacity: 0, y: 24 },
  animate: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const scaleIn = {
  initial: { opacity: 0, scale: 0.92 },
  animate: {
    opacity: 1,
    scale: 1,
    transition: { duration: 0.5, ease: [0.25, 0.1, 0.25, 1] },
  },
};

const features = [
  {
    icon: MessageCircle,
    title: "Instant Connection",
    desc: "A simple hello opens the door. No sign-ups, no friction — just pure, immediate conversation.",
  },
  {
    icon: Zap,
    title: "Lightning Fast",
    desc: "Built for speed. Messages arrive in real-time with zero lag. Say hi and get a response instantly.",
  },
  {
    icon: Shield,
    title: "Private by Design",
    desc: "Your conversations stay yours. End-to-end encryption built in from the ground up.",
  },
  {
    icon: Sparkles,
    title: "Minimal & Beautiful",
    desc: "No bloat, no noise. Just a clean space designed for genuine human connection.",
  },
];

export default function Landing() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background"
    >
      {/* Navigation */}
      <motion.header
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.4, ease: [0.25, 0.1, 0.25, 1] }}
        className="fixed top-0 left-0 right-0 z-50 bg-background border-b-2 border-foreground"
      >
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 h-14">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 bg-foreground flex items-center justify-center">
              <span className="text-background text-sm font-bold leading-none">hi</span>
            </div>
            <span className="font-bold text-lg tracking-tight">hello</span>
          </div>
          <nav className="flex items-center gap-4">
            <Button
              variant="ghost"
              className="rounded-none text-sm font-medium hover:bg-secondary"
              onClick={() => navigate("/auth")}
            >
              Sign in
            </Button>
            <Button
              className="rounded-none brutal-shadow bg-foreground text-background hover:bg-foreground/90 font-medium text-sm"
              onClick={() => navigate("/auth")}
            >
              Get Started
              <ArrowRight className="ml-1.5 h-3.5 w-3.5" />
            </Button>
          </nav>
        </div>
      </motion.header>

      {/* Hero Section */}
      <section className="relative pt-28 pb-20 px-6 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-20 right-10 w-64 h-64 bg-accent/10 rounded-none border-2 border-foreground/20 brutal-shadow -z-10" />
        <div className="absolute bottom-10 left-10 w-48 h-48 bg-accent/5 rounded-none border-2 border-foreground/10 brutal-shadow -z-10" />
        <div className="absolute top-40 left-1/3 w-32 h-32 bg-foreground/5 rounded-none border-2 border-foreground/10 -z-10" />

        <motion.div
          variants={stagger}
          initial="initial"
          animate="animate"
          className="mx-auto max-w-6xl"
        >
          <div className="max-w-3xl">
            <motion.div
              variants={fadeUp}
              className="inline-block brutal-border bg-secondary px-4 py-1.5 mb-6"
            >
              <span className="text-xs font-bold tracking-widest uppercase">
                A New Way to Connect
              </span>
            </motion.div>

            <motion.h1
              variants={scaleIn}
              className="text-8xl sm:text-9xl md:text-[10rem] font-black tracking-tighter leading-[0.85] mb-6 text-foreground"
            >
              hi.
            </motion.h1>

            <motion.p
              variants={fadeUp}
              className="text-lg sm:text-xl max-w-xl text-foreground/70 leading-relaxed mb-10"
            >
              The simplest way to start a conversation.
              <br />
              No accounts. No noise. Just you and the people who matter.
            </motion.p>

            <motion.div variants={fadeUp} className="flex flex-wrap gap-4">
              <Button
                size="lg"
                className="rounded-none brutal-shadow bg-foreground text-background hover:bg-foreground/90 font-bold text-base px-8 h-14"
                onClick={() => navigate("/auth")}
              >
                Start Saying Hi
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-none brutal-shadow border-2 border-foreground bg-background text-foreground hover:bg-secondary font-bold text-base px-8 h-14"
              >
                Learn More
              </Button>
            </motion.div>
          </div>

          {/* Stats row */}
          <motion.div
            variants={fadeUp}
            className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4"
          >
            {[
              { label: "Active Users", value: "12K+" },
              { label: "Messages Sent", value: "1.2M" },
              { label: "Avg Response", value: "< 2s" },
              { label: "Uptime", value: "99.9%" },
            ].map((stat) => (
              <div
                key={stat.label}
                className="brutal-border bg-card px-5 py-4 flex flex-col"
              >
                <span className="text-2xl font-black text-foreground">
                  {stat.value}
                </span>
                <span className="text-xs font-medium text-foreground/60 uppercase tracking-wider mt-1">
                  {stat.label}
                </span>
              </div>
            ))}
          </motion.div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 border-t-2 border-foreground bg-card">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true, margin: "-100px" }}
          variants={stagger}
          className="mx-auto max-w-6xl"
        >
          <motion.div variants={fadeUp} className="mb-14 max-w-2xl">
            <div className="inline-block brutal-border bg-secondary px-4 py-1.5 mb-4">
              <span className="text-xs font-bold tracking-widest uppercase">
                Why hi?
              </span>
            </div>
            <h2 className="text-4xl sm:text-5xl font-black tracking-tight text-foreground leading-[1.05]">
              Everything you need,
              <br />
              nothing you don&apos;t.
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            {features.map((feature, i) => {
              const Icon = feature.icon;
              return (
                <motion.div
                  key={feature.title}
                  variants={scaleIn}
                  className="brutal-border bg-background p-7 flex flex-col gap-4 hover:translate-x-[2px] hover:translate-y-[2px] transition-all duration-200"
                >
                  <div className="w-11 h-11 bg-secondary brutal-border flex items-center justify-center">
                    <Icon className="h-5 w-5 text-foreground" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-foreground">
                      {feature.title}
                    </h3>
                    <p className="text-sm text-foreground/60 mt-2 leading-relaxed">
                      {feature.desc}
                    </p>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </motion.div>
      </section>

      {/* CTA Section */}
      <section className="py-24 px-6 border-t-2 border-foreground">
        <motion.div
          initial="initial"
          whileInView="animate"
          viewport={{ once: true }}
          variants={stagger}
          className="mx-auto max-w-4xl text-center"
        >
          <motion.div
            variants={scaleIn}
            className="inline-block brutal-border bg-accent/20 px-5 py-2 mb-6"
          >
            <span className="text-xs font-bold tracking-widest uppercase text-foreground">
              Get Started Free
            </span>
          </motion.div>

          <motion.h2
            variants={fadeUp}
            className="text-5xl sm:text-7xl font-black tracking-tighter text-foreground leading-[0.9] mb-6"
          >
            Ready to say
            <br />
            <span className="text-accent">hi</span>?
          </motion.h2>

          <motion.p
            variants={fadeUp}
            className="text-lg text-foreground/60 max-w-lg mx-auto mb-10"
          >
            Join thousands already connecting the simple way.
            <br />
            No commitment. No credit card. Just hello.
          </motion.p>

          <motion.div variants={fadeUp}>
            <Button
              size="lg"
              className="rounded-none brutal-shadow bg-accent text-accent-foreground hover:bg-accent/90 font-bold text-lg px-10 h-16"
              onClick={() => navigate("/auth")}
            >
              Say Hello Now
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </motion.div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="border-t-2 border-foreground bg-foreground text-background py-8 px-6">
        <div className="mx-auto max-w-6xl flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 bg-background flex items-center justify-center">
              <span className="text-foreground text-xs font-bold">hi</span>
            </div>
            <span className="font-bold text-sm">hello</span>
          </div>
          <p className="text-xs text-background/60">
            &copy; 2026 hello. Minimal by design.
          </p>
        </div>
      </footer>
    </motion.div>
  );
}
