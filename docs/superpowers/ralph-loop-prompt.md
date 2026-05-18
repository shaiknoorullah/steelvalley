# Steel Valley — Ralph Loop Master Prompt

> **For the agent (you):** This is the prompt Ralph re-fires every iteration. Same prompt, fresh context, but the working tree, git history, and the live state file `docs/prep-status.md` persist between iterations — that's how you see your own progress.
>
> **For the user:** invoke this loop with:
> ```
> /ralph-loop "Read docs/superpowers/ralph-loop-prompt.md and execute one iteration of the Steel Valley redesign. Follow the protocol exactly. Emit <promise>STEELVALLEY_DONE</promise> only when everything in §5 is satisfied. If blocked, emit a <promise>BLOCKED_…</promise> per §3." --completion-promise "STEELVALLEY_DONE" --max-iterations 200
> ```

---

## 0. Project context (read these every iteration)

In order:

1. `docs/superpowers/specs/2026-05-18-steelvalley-redesign.md` — strategic spec (palette, IA, perf contract)
2. `docs/superpowers/specs/2026-05-18-hero-from-blueprint-to-build.md` — hero spec
3. `docs/superpowers/specs/2026-05-18-loading-and-transitions.md` — loader + transitions spec
4. `docs/prep-status.md` — **live progress tracker** (created by Plan 1 Task 10; check first to see what's done)
5. The active plan file in `docs/superpowers/plans/` (1 → 2 → 3 → 4 → 5; then write+execute Plan 6 and Plan 7 via `superpowers:writing-plans`)
6. `~/.claude/projects/-home-devsupreme-work-steelvalley/memory/MEMORY.md` (auto-loaded but verify the two feedback memories are still present)

If `docs/prep-status.md` does not exist yet, Plan 1 Task 10 creates it. Until then, infer state from git log + the existence of expected files.

## 1. Telegram bridge — read state, then send

Telegram chat_id lives at `.claude/telegram-chat-id.local` (git-ignored).

**Every iteration, BEFORE doing anything else:**

```
# 1. Look for an inbound Telegram message in this conversation
#    (a <channel source="telegram" chat_id="..." …> block)
# 2. If found AND .claude/telegram-chat-id.local doesn't exist or differs: save it
# 3. If .claude/telegram-chat-id.local exists: use it for outbound replies
```

When you save the chat_id, write:
```
mkdir -p .claude
echo "<chat_id>" > .claude/telegram-chat-id.local
```

**Sending updates:** use the `mcp__plugin_telegram_telegram__reply` tool with `chat_id` from the file. Use `format: "markdownv2"` only if you escape MarkdownV2 special chars. Default to `format: "text"` for safety.

**When to send a Telegram message:**
- Iteration start (brief — "Iteration N: starting Plan X Task Y")
- On every blocker (detailed — what's needed, how to provide it)
- On every plan completion ("✅ Plan X complete — N commits, all tests green")
- On final completion (the deploy URL + the checklist)

**Don't spam:** edit a single "current status" message via `edit_message` for fine-grained progress; only send a NEW `reply` when crossing a milestone (so the user's device pings).

## 2. Iteration protocol

```
1. Read 0§ context files (above)
2. Run §1 Telegram bridge sequence
3. Determine active plan + next incomplete task:
   - Scan docs/prep-status.md if it exists
   - Else: scan git log for the latest "feat:" / "chore:" commit matching a plan's commit messages
   - Else: start at Plan 1 Task 1
4. If §3 BLOCKER conditions are met: send Telegram → emit <promise> → exit
5. Else: execute the next task per the plan
   - Follow steps in order, run verification commands when the plan specifies them
   - If a step's verification fails: fix and re-run; don't skip
   - Commit per the plan's commit message (heredoc form, no --no-verify)
6. After the task: update docs/prep-status.md (status row + "what runs locally today" list)
7. Send Telegram update (edit the pinned status; new reply only on plan-completion)
8. Exit normally (Ralph re-fires). Do NOT emit a completion promise unless §4 or §5 conditions met.
```

## 3. Blocker matrix (emit the matching promise tag, send Telegram, then exit)

| Blocker | When | Telegram ask | Promise tag |
|---------|------|--------------|-------------|
| No Telegram chat_id captured yet | First iteration with no `.claude/telegram-chat-id.local` and no inbound `<channel source="telegram">` block in conversation | (can't send — output ask to user via stdout) | `<promise>NEED_TELEGRAM_PING</promise>` |
| Airtable key not rotated | Plan 1 Task 1 Step 4 — user must rotate manually in Airtable dashboard, paste new token | "Rotate Airtable token (revoke old `pat...19e`, generate new, paste back). Until done I can't continue with security scrub." | `<promise>BLOCKED_AIRTABLE_ROTATION</promise>` |
| `.env.local` missing new token | Plan 1 Task 2 Step 3 | Same as above | `<promise>BLOCKED_AIRTABLE_TOKEN_LOCAL</promise>` |
| Destructive history rewrite needs explicit confirmation | Plan 1 Task 4 — force-push rewritten history to remote | "Ready to scrub `.env` from git history and force-push to `origin/main`. This affects every clone. Reply 'scrub' to proceed." | `<promise>BLOCKED_HISTORY_SCRUB_CONFIRM</promise>` |
| `git-filter-repo` not installed | Plan 1 Task 3 — sudo install | "Run `sudo pacman -S --noconfirm git-filter-repo` and ping me." | `<promise>BLOCKED_INSTALL_FILTER_REPO</promise>` |
| Supabase credentials missing | Plan 2 Task 1 | Full Supabase setup ask (URL, anon key, service_role, DB pooler, S3 endpoint + access keys, two buckets `media` public + `lead-magnets` private) | `<promise>BLOCKED_SUPABASE</promise>` |
| Resend credentials missing | Plan 4 Task 1 | "Resend API key + verified FROM email + sales email" | `<promise>BLOCKED_RESEND</promise>` |
| OpenPanel credentials missing | Plan 4 Task 1 | "OpenPanel client ID + client secret from openpanel.dev" | `<promise>BLOCKED_OPENPANEL</promise>` |
| WhatsApp number missing | Plan 4 Task 1 | "Sales WhatsApp number in international format (+9665XXXXXXXX)" | `<promise>BLOCKED_WHATSAPP</promise>` |
| GitHub repo secrets missing | Plan 5 Task 6 | "Add DATABASE_URL_TEST + PAYLOAD_SECRET_TEST to repo secrets (separate CI Supabase)" | `<promise>BLOCKED_CI_SECRETS</promise>` |
| Photography / kitchen plate missing | Plan 6 Place stage | Placeholder ships; not actually blocking dev — log a TODO, don't emit promise |  |
| Native Saudi copy review | Pre-launch only | Don't block dev; surface at deploy gate | `<promise>BLOCKED_COPY_REVIEW</promise>` (only at deploy time) |
| Vercel CLI not installed | Final deploy task | "Run `npm i -g vercel` and `vercel login`, then ping me." | `<promise>BLOCKED_VERCEL_CLI</promise>` |

After emitting any blocker promise, send the Telegram ask THEN stop iterating. The user resumes the loop after unblocking.

## 4. Test gate — don't ship green-claims without evidence

Per `superpowers:verification-before-completion`: before claiming a task complete OR sending a "✅ done" Telegram, the verification command from the plan MUST have actually run and passed. Show output (or a tail of it) in the commit message or prep-status.md.

If a verification fails and you can't fix in one iteration: keep prep-status.md showing the task as "in_progress with failures" and re-attempt next iteration. After 3 failed iterations on the same task: emit `<promise>BLOCKED_INVESTIGATION</promise>` and send Telegram with the full failure output.

## 5. Completion criteria — emit `<promise>STEELVALLEY_DONE</promise>` only when ALL of these are true

- `docs/prep-status.md` shows Plans 1–7 marked ✅ complete + pushed
- `git status` on the `redesign` branch is clean
- `npm run build` succeeds
- `npm test` passes (all unit tests)
- `npm run test:e2e` passes (Playwright + axe, zero critical violations on `/dev/components` and `/`)
- `npm run size` passes (size-limit budgets)
- `npm run lhci` passes locally (Lighthouse CI thresholds met for `/`, `/en`, `/dev/components`)
- A Vercel preview URL has been generated (via `vercel deploy --prebuilt` or equivalent)
- `chrome-devtools-mcp:debug-optimize-lcp` and `chrome-devtools-mcp:a11y-debugging` have been run against the preview URL, both green
- The hero `/` route loads, the 5-stage pinned arc plays end-to-end on desktop + mobile fallback
- The Quote Builder submits successfully (curl test against deployed URL returns `201` with reference)
- The lead-magnet popup fires and emails deliver (verified by checking Resend dashboard via response codes)
- The static loader displays the Arabic anthem line `حديد جدّة، يطعم المملكة` on every locale
- A final Telegram message has been sent with: preview URL, production URL (if promoted), checklist, and the launch-gate items (Saudi copy review, photography swap, lead-magnet PDF)

Only then: `<promise>STEELVALLEY_DONE</promise>`.

## 6. Operating principles

- **No skipping verification.** Every plan task's "verify" step runs. Failures get fixed before commit.
- **One task per iteration, ideally.** Don't bundle multiple plan tasks unless they're trivially coupled (e.g., a tiny fix to a file you just created).
- **Always commit per the plan's exact commit message.** Don't paraphrase.
- **Never use `--no-verify` or `--force` without explicit user confirmation.** The history scrub (Plan 1 Task 4) is the ONE exception, and it's behind `<promise>BLOCKED_HISTORY_SCRUB_CONFIRM</promise>`.
- **Respect global rules in `~/.claude/CLAUDE.md`** — Arabic is never translation, the Saudi copy toolkit applies to every string.
- **Use the `marketing-skills:*` and `great-web-copy:*` skills when writing real copy** (Plan 4, Plan 6 headlines). Invoke them explicitly via the Skill tool.
- **Use `core-3d-animation:*` and `blender-web-pipeline` skills when building Plan 6.**
- **If you find a bug in a spec or plan, fix the spec/plan first, commit the fix, then resume execution.**
- **If conversation context runs low (compaction warning), trust `docs/prep-status.md` over conversation memory.**

## 7. First-iteration checklist

The very first iteration (when this prompt fires for the first time) MUST:

1. Run §1 Telegram bridge — if no chat_id and no inbound msg, emit `NEED_TELEGRAM_PING` and stop.
2. Check if Plan 1 Task 1 audit has run (look for the commit `chore(security): tighten .gitignore and add .env.example` — if present, Task 2 done). Plan 1 Task 1 Step 4 must already have surfaced the rotation ask via Telegram.
3. If Airtable rotation status unknown — ask via Telegram, emit `BLOCKED_AIRTABLE_ROTATION`, stop.
4. Else: continue from the next incomplete task.

## 8. Failure modes — when to escalate to the user

If you encounter any of:

- A spec contradicts itself (e.g., font tokens disagree between two specs)
- A library API has changed materially since the spec was written
- A test failure that 3 iterations can't fix
- A perf budget that can't be met even after optimization
- The destructive ops in Plan 1 Task 4 have edge cases (e.g., unrelated `.env` content in old commits)
- A choice that affects user-visible copy / branding / IA

… STOP, send Telegram with the question, emit `<promise>BLOCKED_INVESTIGATION</promise>`, wait for human direction.

---

End of master prompt. Re-fired by Ralph each iteration. State lives in files, not in conversation.
