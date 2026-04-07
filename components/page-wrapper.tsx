"use client";
import { ReactNode } from "react";
import { Nav } from "./nav";

interface PageWrapperProps {
  children: ReactNode;
  title: string;
  description: string;
  active?: string;
}

export function PageWrapper({ children, title, description, active }: PageWrapperProps) {
  return (
    <div>
      <Nav active={active as any} />
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl font-bold text-gray-900">{title}</h1>
            <p className="text-gray-600 mt-1">{description}</p>
          </div>
          {children}
        </div>
      </div>
    </div>
  );
}
