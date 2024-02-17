"use client";

import { Search } from "lucide-react";
import { Input } from "./ui/input";

const SearchBar = () => {
  return (
    <div className="relative hidden sm:block">
      <Search className="absolute h-4 w-4 top-3 left-3 text-muted-foreground" />
      <Input placeholder="Search" className="pl-10 bg-primary/10" />
    </div>
  );
};

export default SearchBar;
