import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/hooks/use-auth";
import { LayoutDashboard, LogOut, MessageCircle, Bell, Users } from "lucide-react";
import { useNavigate } from "react-router";

export default function Dashboard() {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };

  return (
    <main className="min-h-screen bg-background">
      {/* Top bar */}
      <header className="border-b-2 border-foreground h-14 flex items-center justify-between px-6 bg-card">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 bg-foreground flex items-center justify-center">
            <span className="text-background text-xs font-bold">hi</span>
          </div>
          <span className="font-bold text-sm text-foreground">hello</span>
        </div>
        <div className="flex items-center gap-3">
          <button className="w-9 h-9 border-2 border-foreground bg-background flex items-center justify-center hover:bg-secondary transition-colors">
            <Bell className="h-4 w-4 text-foreground" />
          </button>
          <div className="w-9 h-9 border-2 border-foreground bg-accent flex items-center justify-center">
            <span className="text-accent-foreground text-sm font-bold">
              {user?.name?.charAt(0)?.toUpperCase() || "U"}
            </span>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-5xl px-6 py-10">
        {/* Welcome header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-10">
          <div>
            <div className="inline-block border-2 border-foreground bg-secondary px-3 py-1 mb-3">
              <span className="text-xs font-bold tracking-widest uppercase text-foreground/70">Dashboard</span>
            </div>
            <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-foreground leading-[1.05]">
              Hey{user?.name ? `, ${user.name}` : " there"}!
            </h1>
            <p className="text-foreground/60 mt-1 font-medium">
              Ready to say hi to someone?
            </p>
          </div>
          <Button
            type="button"
            variant="outline"
            className="rounded-none border-2 border-foreground bg-background text-foreground hover:bg-secondary gap-2 h-11 font-bold"
            onClick={handleSignOut}
          >
            <LogOut className="size-4" />
            Sign out
          </Button>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
          {[
            { icon: MessageCircle, label: "Conversations", value: "0" },
            { icon: Users, label: "Connections", value: "0" },
            { icon: Bell, label: "Notifications", value: "0" },
          ].map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="border-2 border-foreground bg-card p-5 flex items-center gap-4"
              >
                <div className="w-11 h-11 border-2 border-foreground bg-secondary flex items-center justify-center shrink-0">
                  <Icon className="h-5 w-5 text-foreground" />
                </div>
                <div>
                  <span className="block text-2xl font-black text-foreground">{stat.value}</span>
                  <span className="text-xs font-bold text-foreground/60 uppercase tracking-wider">
                    {stat.label}
                  </span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Main content card */}
        <Card className="border-2 border-foreground rounded-none brutal-shadow">
          <CardHeader>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-11 h-11 border-2 border-foreground bg-accent flex items-center justify-center">
                <LayoutDashboard className="h-5 w-5 text-accent-foreground" />
              </div>
              <CardTitle className="font-black text-foreground tracking-tight">
                Your dashboard is ready
              </CardTitle>
            </div>
          </CardHeader>
          <CardContent className="text-sm leading-relaxed text-foreground/60">
            <p className="mb-4">
              This is your private workspace. Start a conversation, check your
              messages, or explore what&apos;s new.
            </p>
            <Button
              className="rounded-none brutal-shadow bg-foreground text-background hover:bg-foreground/90 font-bold"
              onClick={() => navigate("/")}
            >
              <MessageCircle className="mr-2 h-4 w-4" />
              Say Hi to Someone
            </Button>
          </CardContent>
        </Card>
      </div>
    </main>
  );
}
