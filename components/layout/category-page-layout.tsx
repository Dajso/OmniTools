'use client';

import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { getToolsByCategory, ToolDefinition } from '@/lib/constants/tool-registry';
import { getToolIcon } from '@/lib/constants/tool-icons';
import { getCategoryConfig } from '@/lib/constants/category-config';

interface CategoryPageLayoutProps {
    categoryId: string;
    title: string;
    description: string;
}

export function CategoryPageLayout({ categoryId, title, description }: CategoryPageLayoutProps) {
    const tools = getToolsByCategory(categoryId as ToolDefinition['category']);
    const category = getCategoryConfig(categoryId);

    if (!category) {
        return null;
    }

    const Icon = category.icon;

    return (
        <main className="py-12">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                {/* Header */}
                <div className="text-center mb-12">
                    <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${category.bgColor} mb-4`}>
                        <Icon className={`h-8 w-8 ${category.iconColor}`} />
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">{title}</h1>
                    <p className="mt-3 text-lg text-gray-600 max-w-2xl mx-auto">
                        {description}
                    </p>
                </div>

                {/* Tools Grid */}
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
                    {tools.map((tool) => {
                        const ToolIcon = getToolIcon(tool.id);
                        return (
                            <Link
                                key={tool.id}
                                href={tool.path}
                                className={`group flex items-start gap-4 rounded-xl bg-white p-5 shadow-sm ring-1 ring-gray-200 hover:shadow-md hover:ring-2 transition-all ${category.hoverColor}`}
                            >
                                <div className={`flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-lg ${category.color}`}>
                                    <ToolIcon className={`h-6 w-6 ${category.iconColor}`} />
                                </div>
                                <div className="flex-1 min-w-0">
                                    <h2 className="font-semibold text-gray-900 group-hover:text-primary transition-colors">
                                        {tool.name}
                                    </h2>
                                    <p className="mt-1 text-sm text-gray-500 line-clamp-2">{tool.description}</p>
                                    <div className={`mt-2 inline-flex items-center text-sm ${category.iconColor}`}>
                                        Åpne verktøy <ChevronRight className="h-4 w-4 ml-1" />
                                    </div>
                                </div>
                            </Link>
                        );
                    })}
                </div>
            </div>
        </main>
    );
}
