/* biome-ignore-all lint/performance/noImgElement: next/og image rendering requires img tags. */
import { ImageResponse } from "next/og";

import { buildPostOgPayload, fetchPostForOg } from "./post-og";

export const alt = "Numatter post preview";
export const size = {
	width: 1200,
	height: 630,
};
export const contentType = "image/png";

type OpenGraphImageProps = {
	params: Promise<{ postId: string }>;
};

const CARD_TEXT_MAX_LENGTH = 180;

export default async function OpenGraphImage({ params }: OpenGraphImageProps) {
	const { postId } = await params;
	const post = await fetchPostForOg(postId);

	if (!post) {
		return new ImageResponse(
			<div
				style={{
					display: "flex",
					width: "100%",
					height: "100%",
					backgroundColor: "#ecf3ff",
					padding: 44,
				}}
			>
				<div
					style={{
						display: "flex",
						width: "100%",
						height: "100%",
						borderRadius: 32,
						backgroundColor: "#ffffff",
						border: "2px solid #d8e5ff",
						alignItems: "center",
						justifyContent: "center",
						fontSize: 44,
						fontWeight: 700,
						color: "#1f365c",
					}}
				>
					Numatter
				</div>
			</div>,
			{
				...size,
			},
		);
	}

	const payload = buildPostOgPayload(post);
	const postText = truncateText(
		normalizeText(post.content) ?? payload.description,
		CARD_TEXT_MAX_LENGTH,
	);

	return new ImageResponse(
		<div
			style={{
				display: "flex",
				width: "100%",
				height: "100%",
				backgroundColor: "#ecf3ff",
				padding: 44,
			}}
		>
			<div
				style={{
					display: "flex",
					flexDirection: "column",
					width: "100%",
					height: "100%",
					borderRadius: 32,
					backgroundColor: "#ffffff",
					border: "2px solid #d8e5ff",
					padding: "34px 38px",
				}}
			>
				<div
					style={{
						display: "flex",
						alignItems: "center",
					}}
				>
					<div
						style={{
							display: "flex",
							width: 72,
							height: 72,
							borderRadius: 9999,
							backgroundColor: "#1c3f77",
							alignItems: "center",
							justifyContent: "center",
							fontSize: 32,
							fontWeight: 700,
							color: "#ffffff",
						}}
					>
						{getAvatarLabel(post.author.name)}
					</div>
					<div
						style={{
							display: "flex",
							flexDirection: "column",
							marginLeft: 16,
							maxWidth: 660,
						}}
					>
						<div
							style={{
								display: "flex",
								fontSize: 36,
								fontWeight: 700,
								color: "#13223b",
							}}
						>
							{truncateText(post.author.name, 36)}
						</div>
						<div
							style={{
								display: "flex",
								marginTop: 3,
								fontSize: 24,
								fontWeight: 500,
								color: "#5b6c88",
							}}
						>
							{payload.handle}
						</div>
					</div>
					<div
						style={{
							display: "flex",
							marginLeft: "auto",
							borderRadius: 9999,
							padding: "10px 18px",
							backgroundColor: "#dbe8ff",
							fontSize: 24,
							fontWeight: 700,
							color: "#1e3a66",
						}}
					>
						Numatter
					</div>
				</div>

				<div
					style={{
						display: "flex",
						marginTop: 22,
						fontSize: 32,
						lineHeight: 1.35,
						fontWeight: 500,
						color: "#1a2740",
						wordBreak: "break-word",
					}}
				>
					{postText}
				</div>

				{payload.imageUrls.length > 0 ? (
					<div
						style={{
							display: "flex",
							position: "relative",
							flex: 1,
							marginTop: 24,
						}}
					>
						<PostImageGrid imageUrls={payload.imageUrls} />
						{payload.isQuoteImageFallback ? (
							<div
								style={{
									display: "flex",
									position: "absolute",
									top: 16,
									right: 16,
									borderRadius: 9999,
									padding: "8px 14px",
									backgroundColor: "rgba(20, 34, 58, 0.78)",
									fontSize: 20,
									fontWeight: 600,
									color: "#f8fbff",
								}}
							>
								Quoted media
							</div>
						) : null}
					</div>
				) : (
					<div
						style={{
							display: "flex",
							alignItems: "center",
							justifyContent: "center",
							flex: 1,
							marginTop: 24,
							borderRadius: 24,
							border: "2px dashed #cedcf6",
							color: "#52617b",
							fontSize: 28,
							fontWeight: 600,
						}}
					>
						Text post preview
					</div>
				)}
			</div>
		</div>,
		{
			...size,
		},
	);
}

type PostImageGridProps = {
	imageUrls: string[];
};

const PostImageGrid = ({ imageUrls }: PostImageGridProps) => {
	const [first, second, third, fourth] = imageUrls;

	if (imageUrls.length === 1 && first) {
		return (
			<div style={singleImageLayoutStyle}>{renderImageTile(first, 0)}</div>
		);
	}

	if (imageUrls.length === 2 && first && second) {
		return (
			<div style={twoImageLayoutStyle}>
				{renderImageTile(first, 0)}
				{renderImageTile(second, 1)}
			</div>
		);
	}

	if (imageUrls.length === 3 && first && second && third) {
		return (
			<div style={threeImageLayoutStyle}>
				<div style={{ display: "flex", flex: 1.3 }}>
					{renderImageTile(first, 0)}
				</div>
				<div
					style={{
						display: "flex",
						flexDirection: "column",
						flex: 1,
						gap: 12,
					}}
				>
					{renderImageTile(second, 1)}
					{renderImageTile(third, 2)}
				</div>
			</div>
		);
	}

	if (first && second && third && fourth) {
		return (
			<div style={fourImageLayoutStyle}>
				<div style={splitColumnStyle}>
					{renderImageTile(first, 0)}
					{renderImageTile(second, 1)}
				</div>
				<div style={splitColumnStyle}>
					{renderImageTile(third, 2)}
					{renderImageTile(fourth, 3)}
				</div>
			</div>
		);
	}

	return (
		<div style={singleImageLayoutStyle}>
			{imageUrls.slice(0, 1).map((url, index) => renderImageTile(url, index))}
		</div>
	);
};

const renderImageTile = (url: string, index: number) => {
	return (
		<div key={`${url}-${index}`} style={imageTileStyle}>
			<img
				src={url}
				alt={`Post media ${index + 1}`}
				style={{
					width: "100%",
					height: "100%",
					objectFit: "cover",
				}}
			/>
		</div>
	);
};

const imageTileStyle = {
	display: "flex",
	flex: 1,
	borderRadius: 18,
	overflow: "hidden",
	backgroundColor: "#dce5f2",
};

const singleImageLayoutStyle = {
	display: "flex",
	flex: 1,
};

const twoImageLayoutStyle = {
	display: "flex",
	flex: 1,
	gap: 12,
};

const threeImageLayoutStyle = {
	display: "flex",
	flex: 1,
	gap: 12,
};

const fourImageLayoutStyle = {
	display: "flex",
	flex: 1,
	gap: 12,
};

const splitColumnStyle = {
	display: "flex",
	flexDirection: "column" as const,
	flex: 1,
	gap: 12,
};

const getAvatarLabel = (name: string): string => {
	const normalizedName = name.trim();
	if (!normalizedName) {
		return "N";
	}

	return normalizedName.slice(0, 1).toUpperCase();
};

const normalizeText = (value: string | null | undefined): string | null => {
	if (typeof value !== "string") {
		return null;
	}

	const normalized = value.replace(/\s+/g, " ").trim();
	if (!normalized) {
		return null;
	}

	return normalized;
};

const truncateText = (value: string, maxLength: number): string => {
	if (value.length <= maxLength) {
		return value;
	}

	if (maxLength <= 3) {
		return value.slice(0, maxLength);
	}

	return `${value.slice(0, maxLength - 3).trimEnd()}...`;
};
