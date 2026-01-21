'use client';

import * as React from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import {
    generateSchema,
    generateScriptTag,
    SCHEMA_TYPES,
    type SchemaType,
    type FAQItem,
    type HowToStep,
} from '@/lib/calculations/creator/schema-markup-generator';
import { Copy, Check, Plus, Trash2 } from 'lucide-react';

function TextInput({
    label,
    value,
    onChange,
    placeholder,
    required = false,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    required?: boolean;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm">{label}{required && <span className="text-destructive ml-1">*</span>}</Label>
            <input
                type="text"
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
            />
        </div>
    );
}

function TextArea({
    label,
    value,
    onChange,
    placeholder,
    rows = 3,
}: {
    label: string;
    value: string;
    onChange: (v: string) => void;
    placeholder?: string;
    rows?: number;
}) {
    return (
        <div className="space-y-1.5">
            <Label className="text-sm">{label}</Label>
            <textarea
                value={value}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                rows={rows}
                className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary resize-y"
            />
        </div>
    );
}

// Article Form
function ArticleForm({ data, onChange }: { data: Record<string, string>; onChange: (d: Record<string, string>) => void }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Headline" value={data.headline || ''} onChange={(v) => onChange({ ...data, headline: v })} required />
            <TextInput label="Author Name" value={data.authorName || ''} onChange={(v) => onChange({ ...data, authorName: v })} required />
            <TextInput label="Author URL" value={data.authorUrl || ''} onChange={(v) => onChange({ ...data, authorUrl: v })} placeholder="https://..." />
            <TextInput label="Publisher Name" value={data.publisherName || ''} onChange={(v) => onChange({ ...data, publisherName: v })} required />
            <TextInput label="Publisher Logo URL" value={data.publisherLogoUrl || ''} onChange={(v) => onChange({ ...data, publisherLogoUrl: v })} required />
            <TextInput label="Image URL" value={data.imageUrl || ''} onChange={(v) => onChange({ ...data, imageUrl: v })} required />
            <TextInput label="Date Published" value={data.datePublished || ''} onChange={(v) => onChange({ ...data, datePublished: v })} placeholder="2024-01-15" required />
            <TextInput label="Date Modified" value={data.dateModified || ''} onChange={(v) => onChange({ ...data, dateModified: v })} placeholder="2024-01-16" />
            <div className="md:col-span-2">
                <TextArea label="Description" value={data.description || ''} onChange={(v) => onChange({ ...data, description: v })} />
            </div>
        </div>
    );
}

// FAQ Form
function FAQForm({ items, onChange }: { items: FAQItem[]; onChange: (items: FAQItem[]) => void }) {
    const addItem = () => onChange([...items, { question: '', answer: '' }]);
    const removeItem = (index: number) => onChange(items.filter((_, i) => i !== index));
    const updateItem = (index: number, field: keyof FAQItem, value: string) => {
        const newItems = [...items];
        newItems[index] = { ...newItems[index], [field]: value };
        onChange(newItems);
    };

    return (
        <div className="space-y-4">
            {items.map((item, i) => (
                <div key={i} className="p-3 border rounded-lg space-y-2">
                    <div className="flex justify-between items-center">
                        <span className="text-sm font-medium">Question {i + 1}</span>
                        <Button variant="ghost" size="sm" onClick={() => removeItem(i)}>
                            <Trash2 className="w-4 h-4" />
                        </Button>
                    </div>
                    <TextInput label="Question" value={item.question} onChange={(v) => updateItem(i, 'question', v)} />
                    <TextArea label="Answer" value={item.answer} onChange={(v) => updateItem(i, 'answer', v)} rows={2} />
                </div>
            ))}
            <Button variant="outline" onClick={addItem} className="w-full">
                <Plus className="w-4 h-4 mr-2" /> Add Question
            </Button>
        </div>
    );
}

// Product Form
function ProductForm({ data, onChange }: { data: Record<string, unknown>; onChange: (d: Record<string, unknown>) => void }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Product Name" value={String(data.name || '')} onChange={(v) => onChange({ ...data, name: v })} required />
            <TextInput label="Brand" value={String(data.brand || '')} onChange={(v) => onChange({ ...data, brand: v })} required />
            <TextInput label="SKU" value={String(data.sku || '')} onChange={(v) => onChange({ ...data, sku: v })} required />
            <TextInput label="Image URL" value={String(data.imageUrl || '')} onChange={(v) => onChange({ ...data, imageUrl: v })} required />
            <TextInput label="Price" value={String(data.price || '')} onChange={(v) => onChange({ ...data, price: parseFloat(v) || 0 })} placeholder="99.99" required />
            <TextInput label="Currency" value={String(data.priceCurrency || 'USD')} onChange={(v) => onChange({ ...data, priceCurrency: v })} placeholder="USD" />
            <div className="space-y-1.5">
                <Label className="text-sm">Availability</Label>
                <select
                    value={String(data.availability || 'InStock')}
                    onChange={(e) => onChange({ ...data, availability: e.target.value })}
                    className="w-full px-3 py-2 border rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-primary"
                >
                    <option value="InStock">In Stock</option>
                    <option value="OutOfStock">Out of Stock</option>
                    <option value="PreOrder">Pre-Order</option>
                </select>
            </div>
            <TextInput label="Rating (1-5)" value={String(data.ratingValue || '')} onChange={(v) => onChange({ ...data, ratingValue: parseFloat(v) })} placeholder="4.5" />
            <div className="md:col-span-2">
                <TextArea label="Description" value={String(data.description || '')} onChange={(v) => onChange({ ...data, description: v })} />
            </div>
        </div>
    );
}

// Simple Organization Form
function OrganizationForm({ data, onChange }: { data: Record<string, string>; onChange: (d: Record<string, string>) => void }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <TextInput label="Organization Name" value={data.name || ''} onChange={(v) => onChange({ ...data, name: v })} required />
            <TextInput label="Website URL" value={data.url || ''} onChange={(v) => onChange({ ...data, url: v })} required />
            <TextInput label="Logo URL" value={data.logoUrl || ''} onChange={(v) => onChange({ ...data, logoUrl: v })} required />
            <TextInput label="Contact Phone" value={data.telephone || ''} onChange={(v) => onChange({ ...data, telephone: v })} />
            <div className="md:col-span-2">
                <TextArea label="Description" value={data.description || ''} onChange={(v) => onChange({ ...data, description: v })} />
            </div>
        </div>
    );
}

export function SchemaMarkupGenerator() {
    const [schemaType, setSchemaType] = React.useState<SchemaType>('Article');
    const [formData, setFormData] = React.useState<Record<string, unknown>>({});
    const [faqItems, setFaqItems] = React.useState<FAQItem[]>([{ question: '', answer: '' }]);
    const [output, setOutput] = React.useState('');
    const [copied, setCopied] = React.useState(false);
    const [showScriptTag, setShowScriptTag] = React.useState(false);

    const handleGenerate = () => {
        try {
            let result: string;

            if (schemaType === 'FAQ') {
                result = generateSchema({ type: 'FAQ', data: { items: faqItems } });
            } else if (schemaType === 'Article') {
                result = generateSchema({
                    type: 'Article',
                    data: formData as Parameters<typeof generateSchema>[0] extends { type: 'Article'; data: infer D } ? D : never
                });
            } else if (schemaType === 'Product') {
                result = generateSchema({
                    type: 'Product',
                    data: {
                        name: String(formData.name || ''),
                        description: String(formData.description || ''),
                        imageUrl: String(formData.imageUrl || ''),
                        brand: String(formData.brand || ''),
                        sku: String(formData.sku || ''),
                        price: Number(formData.price) || 0,
                        priceCurrency: String(formData.priceCurrency || 'USD'),
                        availability: (formData.availability as 'InStock' | 'OutOfStock' | 'PreOrder') || 'InStock',
                        ratingValue: Number(formData.ratingValue) || undefined,
                        reviewCount: Number(formData.reviewCount) || undefined,
                    }
                });
            } else if (schemaType === 'Organization') {
                result = generateSchema({
                    type: 'Organization',
                    data: {
                        name: String(formData.name || ''),
                        url: String(formData.url || ''),
                        logoUrl: String(formData.logoUrl || ''),
                        description: String(formData.description || ''),
                        contactPoint: formData.telephone ? {
                            telephone: String(formData.telephone),
                            contactType: 'customer service',
                        } : undefined,
                    }
                });
            } else {
                result = '// Select a schema type and fill in the form';
            }

            setOutput(showScriptTag ? generateScriptTag(result) : result);
        } catch (e) {
            setOutput(`Error: ${e instanceof Error ? e.message : 'Generation failed'}`);
        }
    };

    React.useEffect(() => {
        handleGenerate();
    }, [formData, faqItems, schemaType, showScriptTag]);

    const copyOutput = async () => {
        if (output) {
            await navigator.clipboard.writeText(output);
            setCopied(true);
            setTimeout(() => setCopied(false), 2000);
        }
    };

    const renderForm = () => {
        switch (schemaType) {
            case 'Article':
                return <ArticleForm data={formData as Record<string, string>} onChange={(d) => setFormData(d)} />;
            case 'FAQ':
                return <FAQForm items={faqItems} onChange={setFaqItems} />;
            case 'Product':
                return <ProductForm data={formData} onChange={setFormData} />;
            case 'Organization':
                return <OrganizationForm data={formData as Record<string, string>} onChange={(d) => setFormData(d)} />;
            default:
                return <p className="text-muted-foreground text-sm">Form for {schemaType} coming soon...</p>;
        }
    };

    return (
        <Card className="w-full max-w-4xl">
            <CardHeader>
                <CardTitle>Schema Markup Generator</CardTitle>
                <CardDescription>
                    Generate JSON-LD structured data for SEO and rich results
                </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
                {/* Schema Type Selection */}
                <div className="space-y-2">
                    <Label>Schema Type</Label>
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                        {SCHEMA_TYPES.map((st) => (
                            <button
                                key={st.type}
                                onClick={() => { setSchemaType(st.type); setFormData({}); }}
                                className={`p-2 border rounded-lg text-left transition-colors ${schemaType === st.type
                                        ? 'border-primary bg-primary/5'
                                        : 'hover:bg-muted'
                                    }`}
                            >
                                <div className="font-medium text-sm">{st.name}</div>
                                <div className="text-xs text-muted-foreground">{st.description}</div>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Dynamic Form */}
                <div className="border-t pt-4">
                    <h3 className="font-medium mb-4">{schemaType} Details</h3>
                    {renderForm()}
                </div>

                {/* Options */}
                <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2 text-sm cursor-pointer">
                        <input
                            type="checkbox"
                            checked={showScriptTag}
                            onChange={(e) => setShowScriptTag(e.target.checked)}
                            className="rounded"
                        />
                        Include script tag
                    </label>
                </div>

                {/* Output */}
                <div className="space-y-2">
                    <div className="flex items-center justify-between">
                        <Label>Generated JSON-LD</Label>
                        <Button variant="ghost" size="sm" onClick={copyOutput}>
                            {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                            <span className="ml-1">{copied ? 'Copied!' : 'Copy'}</span>
                        </Button>
                    </div>
                    <pre className="p-4 bg-muted rounded-lg text-xs overflow-x-auto max-h-80 overflow-y-auto">
                        <code>{output || '// Fill in the form to generate schema'}</code>
                    </pre>
                </div>
            </CardContent>
        </Card>
    );
}

export default SchemaMarkupGenerator;
