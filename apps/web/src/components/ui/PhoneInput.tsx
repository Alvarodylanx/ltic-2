'use client';

import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, Check, X, Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { COUNTRY_DATA, findByName, type CountryInfo } from '@/lib/countries';

function FlagImg({ code }: { code: string }) {
  if (code === 'XX' || code === 'OT') {
    return <Globe className="h-3.5 w-5 text-muted-foreground" />;
  }
  return (
    <img
      src={`https://flagcdn.com/w20/${code.toLowerCase()}.png`}
      srcSet={`https://flagcdn.com/w40/${code.toLowerCase()}.png 2x`}
      alt={code}
      className="h-3.5 w-5 object-cover rounded-sm"
      loading="lazy"
    />
  );
}

interface PhoneInputProps {
  value?: string;
  onChange: (value: string) => void;
  /** Country name from the country selector — keeps dial code in sync */
  syncCountry?: string;
  required?: boolean;
  className?: string;
  id?: string;
}

const DEFAULT_COUNTRY = COUNTRY_DATA.find(c => c.code === 'CM')!;

/** Strip everything except digits from a string */
const digitsOnly = (s: string) => s.replace(/\D/g, '');

export function PhoneInput({ value, onChange, syncCountry, required, className, id }: PhoneInputProps) {
  const [selected, setSelected] = useState<CountryInfo>(DEFAULT_COUNTRY);
  const [local, setLocal] = useState('');
  const [open, setOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [touched, setTouched] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  // Sync dial code when parent country changes
  useEffect(() => {
    if (!syncCountry) return;
    const found = findByName(syncCountry);
    if (found) setSelected(found);
  }, [syncCountry]);

  // Notify parent with full international number
  useEffect(() => {
    const digits = digitsOnly(local);
    onChange(digits ? `${selected.dial}${digits}` : '');
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [local, selected]);

  // Close on outside click
  useEffect(() => {
    const handler = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
        setSearch('');
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Focus search when dropdown opens
  useEffect(() => {
    if (open) setTimeout(() => searchRef.current?.focus(), 50);
  }, [open]);

  const digits = digitsOnly(local);
  const isValid = !digits || selected.pattern.test(digits);
  const showIndicator = touched && local.length > 0;

  const filtered = search
    ? COUNTRY_DATA.filter(c =>
        c.name.toLowerCase().includes(search.toLowerCase()) || c.dial.includes(search)
      )
    : COUNTRY_DATA;

  const pickCountry = (c: CountryInfo) => {
    setSelected(c);
    setOpen(false);
    setSearch('');
  };

  return (
    <div className={cn('flex', className)} ref={dropdownRef}>
      {/* Dial code button */}
      <div className="relative flex-shrink-0">
        <button
          type="button"
          onClick={() => setOpen(v => !v)}
          className="h-10 px-2.5 flex items-center gap-1 border border-r-0 rounded-l-md bg-background hover:bg-muted transition-colors text-sm font-medium min-w-[80px]"
        >
          <FlagImg code={selected.code} />
          <span className="text-muted-foreground text-xs">{selected.dial}</span>
          <ChevronDown className={cn('h-3 w-3 text-muted-foreground transition-transform', open && 'rotate-180')} />
        </button>

        <AnimatePresence>
          {open && (
            <motion.div
              initial={{ opacity: 0, y: -6, scale: 0.97 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -4, scale: 0.97 }}
              transition={{ duration: 0.14 }}
              className="absolute top-full left-0 mt-1 w-64 bg-background border rounded-xl shadow-xl z-[60] overflow-hidden"
            >
              {/* Search */}
              <div className="p-2 border-b">
                <input
                  ref={searchRef}
                  id="phone-country-search"
                  name="phone-country-search"
                  type="search"
                  autoComplete="off"
                  value={search}
                  onChange={e => setSearch(e.target.value)}
                  placeholder="Search country or code…"
                  aria-label="Search country or dial code"
                  className="w-full px-2.5 py-1.5 text-xs bg-muted rounded-lg outline-none placeholder:text-muted-foreground"
                />
              </div>
              {/* List */}
              <div className="max-h-52 overflow-y-auto">
                {filtered.length === 0 && (
                  <p className="text-xs text-muted-foreground px-3 py-4 text-center">No results</p>
                )}
                {filtered.map(c => (
                  <button
                    key={c.code + c.name}
                    type="button"
                    onClick={() => pickCountry(c)}
                    className={cn(
                      'w-full flex items-center gap-2 px-3 py-2 text-sm hover:bg-muted transition-colors text-left',
                      selected.code === c.code && selected.dial === c.dial && 'bg-primary/10 text-primary font-medium'
                    )}
                  >
                    <FlagImg code={c.code} />
                    <span className="flex-1 truncate">{c.name}</span>
                    <span className="text-muted-foreground text-xs tabular-nums">{c.dial}</span>
                  </button>
                ))}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Local number input */}
      <div className="relative flex-1">
        <input
          id={id}
          type="tel"
          value={local}
          onChange={e => setLocal(e.target.value)}
          onBlur={() => setTouched(true)}
          placeholder={selected.example}
          required={required}
          className={cn(
            'flex h-10 w-full rounded-r-md border bg-background px-3 pr-8 text-sm',
            'ring-offset-background placeholder:text-muted-foreground',
            'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-0',
            touched && local && !isValid && 'border-destructive focus-visible:ring-destructive'
          )}
        />
        {showIndicator && (
          <span className="absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none">
            {isValid
              ? <Check className="h-3.5 w-3.5 text-green-500" />
              : <X className="h-3.5 w-3.5 text-destructive" />
            }
          </span>
        )}
      </div>
    </div>
  );
}
