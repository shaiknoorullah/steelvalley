"use client";
import { useState } from "react";
import {
  Button,
  IconButton,
  Link,
  Input,
  Textarea,
  Field,
  Checkbox,
  RadioGroup,
  RadioGroupItem,
  RadioCard,
  Select,
  SelectTrigger,
  SelectContent,
  SelectItem,
  SelectValue,
  Stepper,
  StepperStep,
  StepperProgress,
  useStepper,
  Dialog,
  DialogTrigger,
  DialogContent,
  Lightbox,
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
  Tabs,
  TabsList,
  TabsTrigger,
  TabsContent,
  Tag,
  ToastProvider,
  Toast,
  ToastTitle,
  ToastViewport,
  Tooltip,
  TooltipProvider,
  SkipToContent,
} from "@/ds/components";

function Pane({ dir, children }: { dir: "ltr" | "rtl"; children: React.ReactNode }) {
  return (
    <section
      dir={dir}
      style={{
        border: "1px solid var(--color-steel)",
        padding: "1rem",
        display: "flex",
        flexDirection: "column",
        gap: "2rem",
      }}
    >
      <h2 style={{ fontFamily: "var(--font-mono)" }}>{dir.toUpperCase()}</h2>
      {children}
    </section>
  );
}

function Showcase() {
  const [open, setOpen] = useState(false);
  const [lbOpen, setLbOpen] = useState(false);

  return (
    <>
      <h3>Buttons</h3>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Button variant="primary">Primary</Button>
        <Button variant="secondary">Secondary</Button>
        <Button variant="ghost">Ghost</Button>
        <Button disabled>Disabled</Button>
        <Button loading>Loading</Button>
        <IconButton label="Like" icon={<span>♡</span>} />
      </div>

      <h3>Links</h3>
      <div style={{ display: "flex", gap: "1rem", flexWrap: "wrap" }}>
        <Link href="/">Internal</Link>
        <Link href="https://example.com">External</Link>
      </div>

      <h3>Form fields</h3>
      <Field label="Email" required help="We don't spam.">
        {({ inputId, describedBy }) => (
          <Input id={inputId} aria-describedby={describedBy} type="email" />
        )}
      </Field>
      <Field label="Message">
        {({ inputId, describedBy }) => (
          <Textarea id={inputId} aria-describedby={describedBy} rows={3} />
        )}
      </Field>

      <h3>Checkbox + Radio</h3>
      <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
        <Checkbox aria-label="Accept terms" /> Accept terms
      </label>
      <RadioGroup defaultValue="a" aria-label="Demo options">
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RadioGroupItem value="a" aria-label="Option A" /> Option A
        </label>
        <label style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
          <RadioGroupItem value="b" aria-label="Option B" /> Option B
        </label>
      </RadioGroup>

      <h3>RadioCard</h3>
      <RadioGroup defaultValue="restaurant" aria-label="Project type" style={{ display: "grid", gap: "0.5rem" }}>
        <RadioCard value="restaurant" title="Restaurant fit-out" description="Cooking lines, prep tables, hoods." />
        <RadioCard value="hotel" title="Hotel kitchen" description="Banquet, room-service, staff dining." />
      </RadioGroup>

      <h3>Select</h3>
      <Select>
        <SelectTrigger aria-label="Choose material">
          <SelectValue placeholder="Choose…" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="ss304">SS 304</SelectItem>
          <SelectItem value="ss316">SS 316</SelectItem>
        </SelectContent>
      </Select>

      <h3>Stepper</h3>
      <Stepper steps={3}>
        <StepperProgress />
        <StepperStep index={0}>Step one content</StepperStep>
        <StepperStep index={1}>Step two content</StepperStep>
        <StepperStep index={2}>Step three content</StepperStep>
        <StepperNav />
      </Stepper>

      <h3>Dialog</h3>
      <Dialog>
        <DialogTrigger asChild>
          <Button>Open dialog</Button>
        </DialogTrigger>
        <DialogContent title="Example dialog" description="With Escape to close + focus trap.">
          <p>Dialog body.</p>
        </DialogContent>
      </Dialog>

      <h3>Lightbox</h3>
      <Button onClick={() => setLbOpen(true)}>Open lightbox</Button>
      <Lightbox
        open={lbOpen}
        onOpenChange={setLbOpen}
        images={[
          { src: "/kitchens/kitchendemo.jpg", alt: "Kitchen one", caption: "Detail shot." },
          { src: "/kitchens/kitchendemo.jpg", alt: "Kitchen two" },
        ]}
      />

      <h3>Accordion</h3>
      <Accordion type="single" collapsible>
        <AccordionItem value="a">
          <AccordionTrigger>What materials?</AccordionTrigger>
          <AccordionContent>SS 304 / SS 316 primarily.</AccordionContent>
        </AccordionItem>
        <AccordionItem value="b">
          <AccordionTrigger>Lead time?</AccordionTrigger>
          <AccordionContent>2–6 weeks depending on scope.</AccordionContent>
        </AccordionItem>
      </Accordion>

      <h3>Tabs</h3>
      <Tabs defaultValue="storage">
        <TabsList>
          <TabsTrigger value="storage">Storage</TabsTrigger>
          <TabsTrigger value="cooking">Cooking</TabsTrigger>
        </TabsList>
        <TabsContent value="storage">Storage content</TabsContent>
        <TabsContent value="cooking">Cooking content</TabsContent>
      </Tabs>

      <h3>Tags</h3>
      <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
        <Tag>neutral</Tag>
        <Tag tone="info">info</Tag>
        <Tag tone="success">success</Tag>
        <Tag tone="warn">warn</Tag>
        <Tag tone="danger">danger</Tag>
      </div>

      <h3>Tooltip</h3>
      <Tooltip label="Polished mirror finish">
        <span data-component="tooltip-target" style={{ textDecoration: "underline dotted" }}>
          #8 mirror
        </span>
      </Tooltip>

      <h3>Toast</h3>
      <Button onClick={() => setOpen(true)}>Show toast</Button>
      <Toast open={open} onOpenChange={setOpen} duration={3000}>
        <ToastTitle>Enquiry received</ToastTitle>
      </Toast>
    </>
  );
}

function StepperNav() {
  const { goPrev, goNext, current, total } = useStepper();
  return (
    <div style={{ display: "flex", gap: "0.5rem" }}>
      <Button variant="ghost" onClick={goPrev} disabled={current === 0}>
        Previous
      </Button>
      <Button onClick={goNext} disabled={current === total - 1}>
        Next
      </Button>
    </div>
  );
}

export default function ComponentsPage() {
  return (
    <TooltipProvider>
      <ToastProvider>
        <SkipToContent />
        <main id="main-content" style={{ padding: "2rem", maxWidth: "1400px", margin: "0 auto" }}>
          <h1>Component showcase</h1>
          <p style={{ fontFamily: "var(--font-mono)" }}>
            Every primitive in LTR + RTL. Tab through to verify focus rings.
          </p>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            <Pane dir="ltr">
              <Showcase />
            </Pane>
            <Pane dir="rtl">
              <Showcase />
            </Pane>
          </div>
        </main>
        <ToastViewport />
      </ToastProvider>
    </TooltipProvider>
  );
}
