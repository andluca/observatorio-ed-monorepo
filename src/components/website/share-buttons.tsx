"use client";

import { Facebook, Twitter, Linkedin, Link as LinkIcon, Check, MessageCircle } from "lucide-react";
import { useState } from "react";

interface ShareButtonsProps {
  url: string;
  title: string;
}

export function ShareButtons({ url, title }: ShareButtonsProps) {
  const [copied, setCopied] = useState(false);

  // Codifica os parâmetros para evitar erros na URL
  const encodedUrl = encodeURIComponent(url);
  const encodedTitle = encodeURIComponent(title);

  const handleCopy = () => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareLinks = [
    {
      name: "WhatsApp",
      icon: <MessageCircle size={16} />,
      // URL universal do WhatsApp
      url: `https://api.whatsapp.com/send?text=${encodedTitle}%20${encodedUrl}`,
      className: "hover:bg-[#25D366] hover:text-white hover:border-[#25D366]",
    },
    {
      name: "LinkedIn",
      icon: <Linkedin size={16} />,
      // URL moderna de compartilhamento do LinkedIn
      url: `https://www.linkedin.com/sharing/share-offsite/?url=${encodedUrl}`,
      className: "hover:bg-[#0A66C2] hover:text-white hover:border-[#0A66C2]",
    },
    {
      name: "Facebook",
      icon: <Facebook size={16} />,
      url: `https://www.facebook.com/sharer/sharer.php?u=${encodedUrl}`,
      className: "hover:bg-[#1877F2] hover:text-white hover:border-[#1877F2]",
    },
    {
      name: "X (Twitter)",
      icon: <Twitter size={16} />,
      url: `https://twitter.com/intent/tweet?text=${encodedTitle}&url=${encodedUrl}`,
      className: "hover:bg-black hover:text-white hover:border-black",
    },
  ];

  return (
    <div className="flex flex-wrap gap-2">
      {shareLinks.map((link) => (
        <a
          key={link.name}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-600 transition-colors text-xs font-medium ${link.className}`}
          title={`Compartilhar no ${link.name}`}
        >
          {link.icon} <span className="hidden sm:inline">{link.name}</span>
        </a>
      ))}

      {/* Botão Genérico / Instagram */}
      <button
        onClick={handleCopy}
        className="flex items-center gap-2 px-3 py-2 border border-gray-300 rounded-md text-gray-600 hover:bg-gray-800 hover:text-white hover:border-gray-800 transition-colors text-xs font-medium"
        title="Copiar Link (Para Instagram, Stories, etc)"
      >
        {copied ? <Check size={16} /> : <LinkIcon size={16} />}
        <span>{copied ? "Link Copiado!" : "Copiar Link"}</span>
      </button>
    </div>
  );
}