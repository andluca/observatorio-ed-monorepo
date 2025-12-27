import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  experimental: {
    serverActions: {
      bodySizeLimit: '10mb', // Aumentando o limite padrão de 1MB
    },
  },
  // Se você tiver configuração de imagens, mantenha aqui
  images: {
    remotePatterns: [
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com', // Permitir imagens do Cloudinary
      },
    ],
  },
};

export default nextConfig;