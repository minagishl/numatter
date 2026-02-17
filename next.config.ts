import { config } from "env";
import type { NextConfig } from "next";

config();

const r2PublicUrl = new URL(process.env.R2_PUBLIC_URL ?? "");
const r2Protocol = r2PublicUrl.protocol === "http:" ? "http" : "https";
const r2Pathname =
	r2PublicUrl.pathname === "/"
		? "/**"
		: `${r2PublicUrl.pathname.replace(/\/$/u, "")}/**`;

const nextConfig: NextConfig = {
	images: {
		remotePatterns: [
			{
				protocol: r2Protocol,
				hostname: r2PublicUrl.hostname,
				port: r2PublicUrl.port,
				pathname: r2Pathname,
			},
		],
	},
};

export default nextConfig;
