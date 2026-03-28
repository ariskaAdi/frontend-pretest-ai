"use client";

import * as React from "react";
import { ModuleCard } from "./ModuleCard";
import type { Module } from "@/types/module.types";

interface ModuleListProps {
  modules: Module[];
}

export function ModuleList({ modules }: ModuleListProps) {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {modules.map((module, i) => (
        <div
          key={module.id}
          style={{ animationDelay: `${i * 100}ms` }}
          className="animate-in fade-in slide-in-from-bottom-4 duration-500">
          <ModuleCard module={module} />
        </div>
      ))}
    </div>
  );
}
