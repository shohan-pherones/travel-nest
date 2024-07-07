"use client";

import { Search } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import qs from "query-string";
import { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "./ui/input";
import { useDebounceValue } from "@/hooks/useDebounceValue";

const SearchBar = () => {
  const searchParams = useSearchParams();
  const title = searchParams.get("title");
  const [value, setValue] = useState(title || "");
  const pathname = usePathname();
  const router = useRouter();

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setValue(e.target.value);
  };

  const debounceValue = useDebounceValue<string>(value, 1000);

  useEffect(() => {
    const query = {
      title: debounceValue,
    };

    const url = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      {
        skipNull: true,
        skipEmptyString: true,
      }
    );

    router.push(url);
    console.log(url);
  }, [debounceValue, router]);

  if (pathname !== "/") return null;

  return (
    <div className="relative hidden sm:block">
      <Search className="absolute h-4 w-4 top-3 left-3 text-muted-foreground" />
      <Input
        value={value}
        onChange={onChange}
        placeholder="Search"
        className="pl-10 bg-primary/10"
      />
    </div>
  );
};

export default SearchBar;
