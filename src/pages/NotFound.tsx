import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { useNavigate } from "react-router";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-background flex flex-col"
    >
      {/* Nav */}
      <header className="border-b-2 border-foreground h-14 flex items-center px-6">
        <button
          onClick={() => navigate("/")}
          className="flex items-center gap-2"
        >
          <div className="w-7 h-7 bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">hi</span>
          </div>
          <span className="font-bold text-sm text-foreground">hello</span>
        </button>
      </header>

      <div className="flex-1 flex items-center justify-center px-6">
        <div className="text-center max-w-md">
          <div className="inline-block border-2 border-foreground bg-secondary px-4 py-2 mb-8">
            <span className="text-sm font-bold tracking-widest uppercase text-foreground/70">Error 404</span>
          </div>
          <h1 className="text-8xl sm:text-9xl font-black tracking-tighter text-foreground leading-[0.85] mb-4">
            oops.
          </h1>
          <p className="text-lg text-foreground/60 font-medium mb-8 leading-relaxed">
            We couldn&apos;t find what you were looking for.
            <br />
            Maybe try saying hi from the start?
          </p>
          <Button
            className="rounded-none brutal-shadow bg-foreground text-background hover:bg-foreground/90 font-bold px-8 h-13 text-base"
            onClick={() => navigate("/")}
          >
            Go back home
          </Button>
        </div>
      </div>
    </motion.div>
  );
}
