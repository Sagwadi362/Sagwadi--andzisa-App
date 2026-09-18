import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useMemo, useState, type FormEvent } from "react";
import {
  ArrowLeft,
  BadgeCheck,
  Ban,
  Bell,
  ChevronRight,
  Flag,
  Home,
  Install,
  LoaderCircle,
  LockKeyhole,
  LogOut,
  Mail,
  MapPin,
  MessageCircle,
  Search,
  Send,
  ShieldCheck,
  Star,
  UserRound,
  Users,
} from "lucide-react";
import type { User } from "@supabase/supabase-js";
import { toast } from "sonner";

import faceLogo from "@/assets/andzisa-face.png";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Toaster } from "@/components/ui/sonner";
import { lovable } from "@/integrations/lovable";
import { supabase } from "@/integrations/supabase/client";

type Profile = {
  id: string;
  full_name: string;
  phone: string | null;
  area: string | null;
  bio: string | null;
};

type Rating = { reviewed_id: string; score: number };
type Message = {
  id: string;
  sender_id: string;
  recipient_id: string;
  body: string;
  created_at: string;
  read_at: string | null;
};
type Tab = "home" | "members" | "messages" | "profile";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Andzisa — Community Trust Network" },
      { name: "description", content: "Build trust through verified profiles, peer safety ratings, and private conversations." },
      { property: "og:title", content: "Andzisa — Community Trust Network" },
      { property: "og:description", content: "A safer way for communities to connect and build trust." },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary" },
    ],
  }),
  component: AndzisaApp,
});

function Brand({ compact = false }: { compact?: boolean }) {
  return (
    <div className="flex items-center gap-3">
      <img src={faceLogo} alt="Andzisa face" width={1024} height={1024} className={compact ? "h-10 w-10 object-contain" : "h-16 w-16 object-contain"} />
      <div>
        <div className={compact ? "text-xl font-extrabold" : "text-3xl font-extrabold"}>Andzisa</div>
        {!compact && <div className="text-sm text-primary-foreground/75">Community Trust Network</div>}
      </div>
    </div>
  );
}

function AuthScreen() {
  const [mode, setMode] = useState<"signup" | "signin">("signup");
  const [loading, setLoading] = useState(false);
  const [fullName, setFullName] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  async function submit(event: FormEvent) {
    event.preventDefault();
    setLoading(true);
    if (mode === "signup") {
      const { data, error } = await supabase.auth.signUp({ email, password, options: { data: { full_name: fullName, phone } } });
      if (!error && data.user) {
        const { error: profileError } = await supabase.from("profiles").upsert({ id: data.user.id, full_name: fullName, phone });
        if (profileError && data.session) toast.error(profileError.message);
      }
      if (error) toast.error(error.message);
      else if (!data.session) toast.success("Check your email to confirm your account.");
    } else {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) toast.error(error.message);
    }
    setLoading(false);
  }

  async function googleSignIn() {
    setLoading(true);
    const result = await lovable.auth.signInWithOAuth("google", { redirect_uri: window.location.origin });
    if (result.error) toast.error(result.error.message);
    setLoading(false);
  }

  return (
    <main className="min-h-screen bg-background lg:grid lg:grid-cols-[1.05fr_.95fr]">
      <section className="brand-panel relative hidden overflow-hidden p-14 text-primary-foreground lg:flex lg:flex-col lg:justify-between">
        <Brand />
        <div className="max-w-xl pb-12">
          <div className="mb-6 inline-flex items-center gap-2 rounded-full border border-primary-foreground/20 px-4 py-2 text-sm"><ShieldCheck className="h-4 w-4" /> Peer-reviewed safety</div>
          <h1 className="text-6xl font-black leading-[1.02]">Trust grows<br />between people.</h1>
          <p className="mt-6 max-w-md text-lg leading-8 text-primary-foreground/75">Verified profiles, honest ratings, and private conversations for safer community connections.</p>
        </div>
        <p className="text-sm text-primary-foreground/60">Built for safer communities.</p>
      </section>

      <section className="flex min-h-screen items-center justify-center px-5 py-10">
        <div className="w-full max-w-md">
          <div className="mb-10 flex justify-center text-primary lg:hidden"><Brand /></div>
          <div className="mb-8">
            <p className="mb-2 text-xs font-bold uppercase text-accent-foreground">Community access</p>
            <h2 className="text-3xl font-black">{mode === "signup" ? "Join Andzisa" : "Welcome back"}</h2>
            <p className="mt-2 text-muted-foreground">{mode === "signup" ? "Create your trusted community profile." : "Sign in to your community."}</p>
          </div>

          <form onSubmit={submit} className="space-y-4">
            {mode === "signup" && <><Field label="Full name"><Input required value={fullName} onChange={(e) => setFullName(e.target.value)} placeholder="Your full name" /></Field><Field label="Phone number"><Input required type="tel" value={phone} onChange={(e) => setPhone(e.target.value)} placeholder="Your phone number" /></Field></>}
            <Field label="Email address"><Input required type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@example.com" /></Field>
            <Field label="Password"><Input required minLength={8} type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="At least 8 characters" /></Field>
            <Button className="h-12 w-full text-base" disabled={loading}>{loading && <LoaderCircle className="animate-spin" />}{mode === "signup" ? "Create account" : "Sign in"}</Button>
          </form>
          <div className="my-5 flex items-center gap-3 text-xs text-muted-foreground"><span className="h-px flex-1 bg-border" />OR<span className="h-px flex-1 bg-border" /></div>
          <Button variant="outline" className="h-12 w-full" onClick={googleSignIn} disabled={loading}><span className="font-black text-google">G</span> Continue with Google</Button>
          <button className="mt-6 w-full text-sm font-semibold text-primary" onClick={() => setMode(mode === "signup" ? "signin" : "signup")}>{mode === "signup" ? "Already a member? Sign in" : "New to Andzisa? Join now"}</button>
          <p className="mt-8 flex items-center justify-center gap-2 text-center text-xs text-muted-foreground"><LockKeyhole className="h-3.5 w-3.5" /> Your details stay protected.</p>
        </div>
      </section>
      <Toaster />
    </main>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return <label className="block"><span className="mb-1.5 block text-sm font-semibold">{label}</span>{children}</label>;
}

function AndzisaApp() {
  const [user, setUser] = useState<User | null>(null);
  const [authReady, setAuthReady] = useState(false);
  useEffect(() => {
    supabase.auth.getSession().then(({ data }) => { setUser(data.session?.user ?? null); setAuthReady(true); });
    const { data } = supabase.auth.onAuthStateChange((_event, session) => setUser(session?.user ?? null));
    return () => data.subscription.unsubscribe();
  }, []);
  if (!authReady) return <div className="flex min-h-screen items-center justify-center"><LoaderCircle className="h-7 w-7 animate-spin text-primary" /></div>;
  return user ? <MemberApp user={user} /> : <AuthScreen />;
}

function MemberApp({ user }: { user: User }) {
  const [tab, setTab] = useState<Tab>("home");
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [ratings, setRatings] = useState<Rating[]>([]);
  const [messages, setMessages] = useState<Message[]>([]);
  const [blocked, setBlocked] = useState<string[]>([]);
  const [selected, setSelected] = useState<Profile | null>(null);
  const [chat, setChat] = useState<Profile | null>(null);
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(true);

  async function loadData() {
    const [p, r, m, b] = await Promise.all([
      supabase.from("profiles").select("id,full_name,phone,area,bio").order("created_at", { ascending: false }),
      supabase.from("ratings").select("reviewed_id,score"),
      supabase.from("messages").select("*").order("created_at", { ascending: true }),
      supabase.from("blocks").select("blocked_id").eq("blocker_id", user.id),
    ]);
    setProfiles(p.data ?? []); setRatings(r.data ?? []); setMessages(m.data ?? []); setBlocked((b.data ?? []).map((x) => x.blocked_id)); setLoading(false);
  }

  useEffect(() => {
    void loadData();
    const channel = supabase.channel("andzisa-messages").on("postgres_changes", { event: "*", schema: "public", table: "messages" }, () => void loadData()).subscribe();
    return () => { void supabase.removeChannel(channel); };
  }, [user.id]);

  const me = profiles.find((p) => p.id === user.id);
  const available = profiles.filter((p) => p.id !== user.id && !blocked.includes(p.id));
  const filtered = available.filter((p) => `${p.full_name} ${p.area ?? ""}`.toLowerCase().includes(query.toLowerCase()));
  const scoreFor = (id: string) => {
    const values = ratings.filter((r) => r.reviewed_id === id).map((r) => r.score);
    return values.length ? values.reduce((a, b) => a + b, 0) / values.length : 0;
  };
  const conversations = useMemo(() => available.filter((p) => messages.some((m) => (m.sender_id === user.id && m.recipient_id === p.id) || (m.recipient_id === user.id && m.sender_id === p.id))), [available, messages, user.id]);

  if (loading) return <div className="flex min-h-screen items-center justify-center"><LoaderCircle className="h-7 w-7 animate-spin text-primary" /></div>;
  if (!me) return <ProfileSetup user={user} onDone={loadData} />;

  if (chat) return <ChatScreen me={me} person={chat} messages={messages} onBack={() => setChat(null)} onChanged={loadData} />;
  if (selected) return <MemberDetail me={me} person={selected} score={scoreFor(selected.id)} ratingCount={ratings.filter((r) => r.reviewed_id === selected.id).length} onBack={() => setSelected(null)} onMessage={() => { setChat(selected); setSelected(null); }} onChanged={loadData} />;

  return (
    <div className="min-h-screen bg-background pb-24 md:pb-0">
      <header className="sticky top-0 z-30 border-b bg-background/95 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-4"><button onClick={() => setTab("home")} className="text-primary"><Brand compact /></button><div className="flex items-center gap-2"><Button size="icon" variant="ghost" aria-label="Notifications"><Bell /></Button><button onClick={() => setTab("profile")} className="flex h-10 w-10 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground">{me.full_name.charAt(0)}</button></div></div>
      </header>
      <div className="mx-auto grid max-w-6xl md:grid-cols-[220px_1fr]">
        <aside className="hidden min-h-[calc(100vh-4rem)] border-r px-4 py-8 md:block"><Nav tab={tab} setTab={setTab} vertical /><div className="mt-10 rounded-lg bg-secondary p-4"><ShieldCheck className="mb-3 h-6 w-6 text-primary" /><p className="text-sm font-bold">Safety comes first</p><p className="mt-1 text-xs leading-5 text-muted-foreground">Report or block anyone who makes you feel unsafe.</p></div></aside>
        <main className="min-w-0 px-4 py-7 sm:px-8 sm:py-10">
          {tab === "home" && <HomeView me={me} members={available} scoreFor={scoreFor} openMember={setSelected} openTab={setTab} />}
          {tab === "members" && <MembersView members={filtered} query={query} setQuery={setQuery} scoreFor={scoreFor} openMember={setSelected} />}
          {tab === "messages" && <MessagesView conversations={conversations} messages={messages} userId={user.id} openChat={setChat} members={available} />}
          {tab === "profile" && <ProfileView me={me} score={scoreFor(me.id)} ratingCount={ratings.filter((r) => r.reviewed_id === me.id).length} onChanged={loadData} />}
        </main>
      </div>
      <nav className="fixed inset-x-0 bottom-0 z-40 border-t bg-background px-2 pb-[env(safe-area-inset-bottom)] md:hidden"><Nav tab={tab} setTab={setTab} /></nav>
      <Toaster />
    </div>
  );
}

function Nav({ tab, setTab, vertical = false }: { tab: Tab; setTab: (tab: Tab) => void; vertical?: boolean }) {
  const items: [Tab, string, typeof Home][] = [["home", "Home", Home], ["members", "Members", Users], ["messages", "Messages", MessageCircle], ["profile", "Profile", UserRound]];
  return <div className={vertical ? "space-y-1" : "grid h-16 grid-cols-4"}>{items.map(([id, label, Icon]) => <button key={id} onClick={() => setTab(id)} className={`${vertical ? "flex w-full flex-row px-3 py-3" : "flex flex-col py-2"} items-center justify-center gap-1 rounded-md text-xs font-semibold ${tab === id ? "bg-secondary text-primary" : "text-muted-foreground"}`}><Icon className="h-5 w-5" />{label}</button>)}</div>;
}

function HomeView({ me, members, scoreFor, openMember, openTab }: { me: Profile; members: Profile[]; scoreFor: (id: string) => number; openMember: (p: Profile) => void; openTab: (t: Tab) => void }) {
  return <div><p className="text-sm text-muted-foreground">Welcome back,</p><h1 className="mt-1 text-3xl font-black">{me.full_name.split(" ")[0]}</h1><section className="trust-banner mt-6 overflow-hidden rounded-lg p-6 text-primary-foreground sm:p-8"><div className="flex max-w-xl items-start gap-4"><ShieldCheck className="mt-1 h-10 w-10 shrink-0 text-gold" /><div><p className="text-xs font-bold uppercase text-gold">Community trust</p><h2 className="mt-2 text-2xl font-black">Safer connections begin with shared accountability.</h2><p className="mt-3 text-sm leading-6 text-primary-foreground/75">Ratings come from real members. Your conversations stay private.</p></div></div></section><div className="mt-9 flex items-end justify-between"><div><p className="text-xs font-bold uppercase text-accent-foreground">Discover</p><h2 className="mt-1 text-xl font-black">People in your community</h2></div><Button variant="ghost" size="sm" onClick={() => openTab("members")}>View all <ChevronRight /></Button></div>{members.length ? <div className="mt-4 grid gap-3 sm:grid-cols-2">{members.slice(0, 4).map((p) => <MemberRow key={p.id} person={p} score={scoreFor(p.id)} onClick={() => openMember(p)} />)}</div> : <Empty icon={Users} title="Your community is growing" text="New members will appear here after they join." />}</div>;
}

function MembersView({ members, query, setQuery, scoreFor, openMember }: { members: Profile[]; query: string; setQuery: (v: string) => void; scoreFor: (id: string) => number; openMember: (p: Profile) => void }) {
  return <div><p className="text-xs font-bold uppercase text-accent-foreground">Community</p><h1 className="mt-1 text-3xl font-black">Find a member</h1><div className="relative mt-6"><Search className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" /><Input className="h-11 pl-10" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search by name or area" /></div><div className="mt-5 grid gap-3 sm:grid-cols-2">{members.map((p) => <MemberRow key={p.id} person={p} score={scoreFor(p.id)} onClick={() => openMember(p)} />)}</div>{!members.length && <Empty icon={Search} title="No members found" text="Try another name or area." />}</div>;
}

function MemberRow({ person, score, onClick }: { person: Profile; score: number; onClick: () => void }) {
  return <button onClick={onClick} className="member-row flex w-full items-center gap-4 rounded-lg border bg-card p-4 text-left transition"><div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-secondary text-lg font-black text-primary">{person.full_name.charAt(0)}</div><div className="min-w-0 flex-1"><div className="flex items-center gap-1.5"><p className="truncate font-bold">{person.full_name}</p><BadgeCheck className="h-4 w-4 shrink-0 text-trust" /></div><p className="mt-1 flex items-center gap-1 text-xs text-muted-foreground">{person.area ? <><MapPin className="h-3 w-3" />{person.area}</> : "Community member"}</p></div><div className="flex items-center gap-1 text-sm font-bold"><Star className="h-4 w-4 fill-gold text-gold" />{score ? score.toFixed(1) : "New"}</div></button>;
}

function MessagesView({ conversations, messages, userId, openChat, members }: { conversations: Profile[]; messages: Message[]; userId: string; openChat: (p: Profile) => void; members: Profile[] }) {
  return <div><p className="text-xs font-bold uppercase text-accent-foreground">Private</p><h1 className="mt-1 text-3xl font-black">Messages</h1>{conversations.length ? <div className="mt-6 divide-y rounded-lg border bg-card">{conversations.map((p) => { const latest = messages.filter((m) => [m.sender_id,m.recipient_id].includes(userId) && [m.sender_id,m.recipient_id].includes(p.id)).at(-1); return <button key={p.id} onClick={() => openChat(p)} className="flex w-full items-center gap-4 p-4 text-left"><div className="flex h-12 w-12 items-center justify-center rounded-full bg-secondary font-black text-primary">{p.full_name.charAt(0)}</div><div className="min-w-0 flex-1"><p className="font-bold">{p.full_name}</p><p className="truncate text-sm text-muted-foreground">{latest?.body}</p></div><ChevronRight className="text-muted-foreground" /></button>; })}</div> : <Empty icon={MessageCircle} title="No conversations yet" text="Choose a community member to start a private conversation." action={members[0] ? <Button onClick={() => openChat(members[0])}>Start a message</Button> : undefined} />}</div>;
}

function ChatScreen({ me, person, messages, onBack, onChanged }: { me: Profile; person: Profile; messages: Message[]; onBack: () => void; onChanged: () => void }) {
  const [body, setBody] = useState("");
  const thread = messages.filter((m) => (m.sender_id === me.id && m.recipient_id === person.id) || (m.sender_id === person.id && m.recipient_id === me.id));
  async function send(event: FormEvent) { event.preventDefault(); const text = body.trim(); if (!text) return; setBody(""); const { error } = await supabase.from("messages").insert({ sender_id: me.id, recipient_id: person.id, body: text }); if (error) toast.error(error.message); else onChanged(); }
  return <div className="mx-auto flex min-h-[calc(100vh-10rem)] max-w-2xl flex-col"><div className="flex items-center gap-3 border-b pb-4"><Button variant="ghost" size="icon" onClick={onBack} aria-label="Back"><ArrowLeft /></Button><div className="flex h-10 w-10 items-center justify-center rounded-full bg-secondary font-black text-primary">{person.full_name.charAt(0)}</div><div><p className="font-bold">{person.full_name}</p><p className="flex items-center gap-1 text-xs text-trust"><LockKeyhole className="h-3 w-3" /> Private conversation</p></div></div><div className="flex flex-1 flex-col justify-end gap-2 py-6">{thread.length ? thread.map((m) => <div key={m.id} className={`max-w-[82%] rounded-lg px-4 py-3 text-sm ${m.sender_id === me.id ? "ml-auto bg-primary text-primary-foreground" : "bg-card border"}`}><p>{m.body}</p><p className={`mt-1 text-[10px] ${m.sender_id === me.id ? "text-primary-foreground/60" : "text-muted-foreground"}`}>{new Date(m.created_at).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</p></div>) : <p className="text-center text-sm text-muted-foreground">Start a respectful conversation with {person.full_name.split(" ")[0]}.</p>}</div><form onSubmit={send} className="sticky bottom-20 flex gap-2 border-t bg-background py-4 md:bottom-0"><Input value={body} onChange={(e) => setBody(e.target.value)} placeholder="Write a message" maxLength={2000} /><Button size="icon" aria-label="Send message"><Send /></Button></form></div>;
}

function MemberDetail({ me, person, score, ratingCount, onBack, onMessage, onChanged }: { me: Profile; person: Profile; score: number; ratingCount: number; onBack: () => void; onMessage: () => void; onChanged: () => void }) {
  const [showReport, setShowReport] = useState(false); const [details, setDetails] = useState("");
  async function rate(value: number) { const { error } = await supabase.from("ratings").upsert({ reviewer_id: me.id, reviewed_id: person.id, score: value }, { onConflict: "reviewer_id,reviewed_id" }); if (error) toast.error(error.message); else { toast.success("Rating saved"); onChanged(); } }
  async function block() { const { error } = await supabase.from("blocks").insert({ blocker_id: me.id, blocked_id: person.id }); if (error) toast.error(error.message); else { toast.success("Member blocked"); onChanged(); onBack(); } }
  async function report() { const { error } = await supabase.from("reports").insert({ reporter_id: me.id, reported_id: person.id, reason: "unsafe_behaviour", details }); if (error) toast.error(error.message); else { toast.success("Private report submitted"); setShowReport(false); setDetails(""); } }
  return <div className="mx-auto max-w-2xl"><Button variant="ghost" onClick={onBack}><ArrowLeft /> Back</Button><div className="mt-6 text-center"><div className="mx-auto flex h-24 w-24 items-center justify-center rounded-full bg-secondary text-4xl font-black text-primary">{person.full_name.charAt(0)}</div><div className="mt-4 flex items-center justify-center gap-2"><h1 className="text-3xl font-black">{person.full_name}</h1><BadgeCheck className="text-trust" /></div><p className="mt-2 text-muted-foreground">{person.area ?? "Community member"}</p></div><div className="mt-8 grid grid-cols-2 gap-3"><div className="rounded-lg border bg-card p-5 text-center"><p className="text-3xl font-black">{score ? score.toFixed(1) : "—"}</p><div className="mt-1 flex justify-center"><Star className="h-4 w-4 fill-gold text-gold" /></div><p className="mt-1 text-xs text-muted-foreground">{ratingCount} peer ratings</p></div><div className="rounded-lg border bg-card p-5 text-center"><ShieldCheck className="mx-auto h-8 w-8 text-trust" /><p className="mt-2 text-sm font-bold">Verified member</p></div></div>{person.bio && <p className="mt-6 rounded-lg bg-secondary p-5 text-sm leading-6">{person.bio}</p>}<Button className="mt-6 h-12 w-full" onClick={onMessage}><MessageCircle /> Send private message</Button><div className="mt-8 border-t pt-6"><p className="text-sm font-bold">Rate your experience</p><div className="mt-3 flex gap-2">{[1,2,3,4,5].map((n) => <Button key={n} size="icon" variant="outline" onClick={() => rate(n)} aria-label={`Rate ${n} stars`}><Star className="fill-gold text-gold" /></Button>)}</div></div><div className="mt-8 flex gap-2 border-t pt-6"><Button variant="outline" className="flex-1" onClick={() => setShowReport(!showReport)}><Flag /> Report</Button><Button variant="destructive" className="flex-1" onClick={block}><Ban /> Block</Button></div>{showReport && <div className="mt-4 rounded-lg border bg-card p-4"><p className="font-bold">Private safety report</p><Textarea className="mt-3" value={details} onChange={(e) => setDetails(e.target.value)} placeholder="Tell the safety team what happened" /><Button className="mt-3 w-full" onClick={report}>Submit report</Button></div>}</div>;
}

function ProfileSetup({ user, onDone }: { user: User; onDone: () => void }) {
  const [name, setName] = useState(String(user.user_metadata?.full_name ?? "")); const [phone, setPhone] = useState(String(user.user_metadata?.phone ?? ""));
  async function submit(e: FormEvent) { e.preventDefault(); const { error } = await supabase.from("profiles").insert({ id: user.id, full_name: name, phone }); if (error) toast.error(error.message); else onDone(); }
  return <main className="flex min-h-screen items-center justify-center bg-background p-5"><form onSubmit={submit} className="w-full max-w-md"><div className="mb-8 text-primary"><Brand /></div><h1 className="text-3xl font-black">Complete your profile</h1><p className="mt-2 text-muted-foreground">Help your community know who they are connecting with.</p><div className="mt-7 space-y-4"><Field label="Full name"><Input required value={name} onChange={(e) => setName(e.target.value)} /></Field><Field label="Phone number"><Input required value={phone} onChange={(e) => setPhone(e.target.value)} /></Field><Button className="h-12 w-full">Continue</Button></div></form><Toaster /></main>;
}

function ProfileView({ me, score, ratingCount, onChanged }: { me: Profile; score: number; ratingCount: number; onChanged: () => void }) {
  const [area, setArea] = useState(me.area ?? ""); const [bio, setBio] = useState(me.bio ?? "");
  async function save() { const { error } = await supabase.from("profiles").update({ area, bio, updated_at: new Date().toISOString() }).eq("id", me.id); if (error) toast.error(error.message); else { toast.success("Profile updated"); onChanged(); } }
  return <div className="mx-auto max-w-2xl"><p className="text-xs font-bold uppercase text-accent-foreground">Your account</p><h1 className="mt-1 text-3xl font-black">Profile</h1><div className="mt-7 flex items-center gap-5"><div className="flex h-20 w-20 items-center justify-center rounded-full bg-secondary text-3xl font-black text-primary">{me.full_name.charAt(0)}</div><div><div className="flex items-center gap-2"><h2 className="text-xl font-black">{me.full_name}</h2><BadgeCheck className="h-5 w-5 text-trust" /></div><p className="mt-1 flex items-center gap-1 text-sm"><Star className="h-4 w-4 fill-gold text-gold" /> {score ? score.toFixed(1) : "No rating yet"} · {ratingCount} ratings</p></div></div><div className="mt-8 space-y-4"><Field label="Area"><Input value={area} onChange={(e) => setArea(e.target.value)} placeholder="Your town or neighbourhood" /></Field><Field label="About you"><Textarea value={bio} onChange={(e) => setBio(e.target.value)} placeholder="A short introduction for the community" maxLength={280} /></Field><Button onClick={save}>Save profile</Button></div><div className="mt-10 border-t pt-6"><Button variant="outline" onClick={() => supabase.auth.signOut()}><LogOut /> Sign out</Button></div><InstallTip /></div>;
}

function InstallTip() { return <div className="mt-8 flex gap-4 rounded-lg bg-secondary p-5"><Install className="h-6 w-6 shrink-0 text-primary" /><div><p className="font-bold">Install Andzisa on your phone</p><p className="mt-1 text-sm leading-6 text-muted-foreground">Open your browser menu and choose “Add to Home Screen” or “Install app.” It’s free.</p></div></div>; }

function Empty({ icon: Icon, title, text, action }: { icon: typeof Mail; title: string; text: string; action?: React.ReactNode }) { return <div className="mt-10 rounded-lg border border-dashed p-10 text-center"><Icon className="mx-auto h-8 w-8 text-muted-foreground" /><p className="mt-4 font-bold">{title}</p><p className="mx-auto mt-2 max-w-sm text-sm text-muted-foreground">{text}</p>{action && <div className="mt-5">{action}</div>}</div>; }