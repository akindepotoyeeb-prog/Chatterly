import { Search, X } from "lucide-react";

export default function SearchInput({ value, onChange, placeholder = "Search", label = "Search" }) {
  return (
    <div className="search" role="search">
      <Search className="search-icon" size={18} aria-hidden="true" />
      <input
        className="input"
        type="search"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        aria-label={label}
      />
      {value && (
        <button className="icon-btn search-clear" onClick={() => onChange("")} aria-label="Clear search">
          <X size={16} />
        </button>
      )}
    </div>
  );
}
