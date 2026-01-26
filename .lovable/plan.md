

# NichePulse AI - Complete Feature Enhancement Plan

This plan covers the implementation of all 5 suggested features to transform NichePulse AI into a more powerful, production-ready application.

---

## Overview

| Feature | Complexity | Impact |
|---------|------------|--------|
| Search Autocomplete | Medium | Enhanced UX |
| Real AI Analysis | High | Core Value |
| Video Previews | Medium | Engagement |
| Export Features | Medium | Utility |
| Theme Toggle | Low | Accessibility |

---

## Feature 1: Search Autocomplete

Add real-time suggestions as users type their interests to guide them toward better niche queries.

### Implementation

**New Component: `SearchSuggestions.tsx`**
- Dropdown positioned below the search input with glassmorphism styling
- Keyboard navigation support (arrow keys, Enter to select, Escape to close)
- Animated appearance using Framer Motion fade-in

**New Hook: `useSearchSuggestions.ts`**
- Debounced input handling (300ms delay)
- Returns filtered suggestions based on user input
- Mock data initially, structured for future API integration

**Mock Suggestions Data:**
```text
- Categories: Fitness, Tech, Gaming, Finance, Lifestyle, Education
- Sub-niches: "Fitness + Tech", "Gaming Reviews", "Personal Finance", etc.
- Popular queries based on the entered keywords
```

**SearchInput Modifications:**
- Add `onBlur` delay to allow suggestion clicks
- Pass suggestions to new dropdown component
- Handle suggestion selection to populate input

---

## Feature 2: Real AI Analysis (Perplexity Integration)

Replace mock data with live AI-powered analysis using the Perplexity API for grounded, real-time insights.

### Architecture

```text
Frontend (React)
     │
     ▼
Supabase Edge Function (/analyze-niche)
     │
     ▼
Perplexity API (sonar-pro model)
     │
     ▼
Structured Response (JSON Schema)
```

### Implementation Steps

1. **Connect Perplexity Connector**
   - Use the standard connector to link Perplexity API key

2. **Create Edge Function: `supabase/functions/analyze-niche/index.ts`**
   - Receives: query, platform, style
   - Calls Perplexity with structured output schema
   - Returns: scorecard, outliers, viral content, ideas, hooks

3. **Update `useNicheAnalysis.ts`**
   - Add `useAI` flag to toggle between mock and real data
   - Fetch from edge function when AI mode enabled
   - Maintain mock fallback for development/demo

4. **Perplexity Prompt Structure:**
   ```text
   Analyze the niche: "{query}" for {platform} content.
   Style preference: {style}
   
   Return structured data including:
   - Market saturation score (0-100)
   - Growth potential score (0-100)
   - Gap analysis score (0-100)
   - Top 3 outlier creators with metrics
   - 6 viral content examples
   - 3 video ideas with difficulty ratings
   - 5 platform-specific viral hooks
   ```

---

## Feature 3: Video Previews (Hover-to-Play)

Enhance VideoCard with hover-to-play functionality for engaging content previews.

### Implementation

**Update `VideoCard.tsx`:**
- Add `isHovered` state with mouse enter/leave handlers
- Conditionally render video preview on hover
- Auto-play muted video with 5-second preview

**New Props for ViralContent Interface:**
```typescript
interface ViralContent {
  // ...existing props
  videoUrl?: string;      // Preview video URL
  previewGif?: string;    // Fallback animated preview
}
```

**Behavior:**
- On hover: Fade from thumbnail to video/gif preview
- Play button overlay fades out during preview
- On mouse leave: Return to thumbnail immediately
- Progressive enhancement: Works with thumbnail-only content

**Mock Data Update:**
- Add sample video URLs to mock data
- Use placeholder videos for demo purposes

---

## Feature 4: Export Features

Allow users to save their analysis results as PDF or shareable links.

### Implementation

**New Component: `ExportMenu.tsx`**
- Dropdown menu with export options
- Apple-styled with glassmorphism
- Icons: Download (PDF), Link (Share), Copy (Clipboard)

**PDF Export:**
- Install: `html2canvas` and `jspdf` packages
- Create `useExportPDF.ts` hook
- Capture dashboard sections and compile into styled PDF
- Include branding header and timestamp

**Share Link:**
- Encode analysis params in URL: `/results?q=fitness&p=youtube&s=faceless`
- Add new route to handle shared results
- Generate shortened/encoded share links

**Copy to Clipboard:**
- Format results as clean text/markdown
- Copy button with success toast notification

**UI Integration:**
- Add Export button to results header
- Position next to "Start Over" when on results page

---

## Feature 5: Theme Toggle (Light/Dark Mode)

Add a premium light mode variant with seamless toggle functionality.

### Implementation

**Setup ThemeProvider:**
- Wrap App with `next-themes` ThemeProvider
- Configure: `attribute="class"`, `defaultTheme="dark"`

**Light Theme Variables (index.css):**
```css
:root {
  --background: 0 0% 100%;
  --foreground: 0 0% 9%;
  --card: 0 0% 98%;
  --muted: 0 0% 96%;
  --primary: 210 100% 50%;
  /* ... adjusted for light mode */
}
```

**New Component: `ThemeToggle.tsx`**
- Sun/Moon icon toggle button
- Animated icon transition
- Positioned in header next to logo

**Glassmorphism Adjustments:**
- Light mode: Slightly darker glass overlay
- Adjust border opacity for visibility
- Ensure text contrast meets WCAG standards

**App.tsx Updates:**
- Import and wrap with ThemeProvider
- Add ThemeToggle to header

---

## File Changes Summary

### New Files
| File | Purpose |
|------|---------|
| `src/components/SearchSuggestions.tsx` | Autocomplete dropdown |
| `src/hooks/useSearchSuggestions.ts` | Debounced suggestions logic |
| `src/components/ExportMenu.tsx` | Export options dropdown |
| `src/hooks/useExportPDF.ts` | PDF generation logic |
| `src/components/ThemeToggle.tsx` | Light/dark mode switch |
| `supabase/functions/analyze-niche/index.ts` | AI analysis edge function |

### Modified Files
| File | Changes |
|------|---------|
| `src/App.tsx` | Add ThemeProvider wrapper |
| `src/pages/Index.tsx` | Add ThemeToggle, ExportMenu, integrate suggestions |
| `src/components/SearchInput.tsx` | Integrate SearchSuggestions |
| `src/components/VideoCard.tsx` | Add hover-to-play functionality |
| `src/hooks/useNicheAnalysis.ts` | Add real AI integration option |
| `src/index.css` | Add light theme variables |
| `tailwind.config.ts` | Minor adjustments for theme support |
| `package.json` | Add html2canvas, jspdf dependencies |

---

## Implementation Order

1. **Theme Toggle** - Foundation for consistent styling
2. **Search Autocomplete** - Enhance initial user experience  
3. **Video Previews** - Improve content engagement
4. **Export Features** - Add utility value
5. **Real AI Analysis** - Connect Perplexity for live data

This order ensures each feature can be tested independently while building toward full functionality.

