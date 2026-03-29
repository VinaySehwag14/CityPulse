'use client';

/**
 * JSON-LD Structured Data component for Google Rich Results.
 * Renders a <script type="application/ld+json"> tag in the page head.
 *
 * Usage (in a page or layout):
 *   <JsonLd data={{ "@type": "WebSite", ... }} />
 */

interface JsonLdProps {
    data: Record<string, unknown>;
}

export default function JsonLd({ data }: JsonLdProps) {
    return (
        <script
            type="application/ld+json"
            dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
        />
    );
}
