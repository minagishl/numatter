type CreateDisplayHandleParams = {
	handle?: string | null;
	name: string | null | undefined;
	userId: string;
};

export const MAX_HANDLE_LENGTH = 15;
const HANDLE_CHARACTER_REGEX = /^[a-z0-9_]+$/;

export const normalizeUserHandle = (value: string): string => {
	return value.trim().toLowerCase().replace(/^@+/, "");
};

export const sanitizeUserHandleDraft = (value: string): string => {
	const normalized = normalizeUserHandle(value);
	return normalized.replace(/[^a-z0-9_]+/g, "").slice(0, MAX_HANDLE_LENGTH);
};

export const isValidUserHandle = (value: string): boolean => {
	return (
		value.length > 0 &&
		value.length <= MAX_HANDLE_LENGTH &&
		HANDLE_CHARACTER_REGEX.test(value)
	);
};

export const parseUserHandle = (
	value: string | null | undefined,
): string | null => {
	if (typeof value !== "string") {
		return null;
	}

	const normalized = normalizeUserHandle(value);
	if (!isValidUserHandle(normalized)) {
		return null;
	}

	return normalized;
};

export const createAutoUserHandleFromUserId = (userId: string): string => {
	return createAutoUserHandleCandidates(userId)[0] ?? "numatter";
};

export const createAutoUserHandleCandidates = (userId: string): string[] => {
	const normalizedId = sanitizeHandleSeed(userId);
	const seed = normalizedId || "user";
	const candidates: string[] = [];

	const addCandidate = (value: string) => {
		if (!isValidUserHandle(value)) {
			return;
		}

		if (candidates.includes(value)) {
			return;
		}

		candidates.push(value);
	};

	addCandidate(seed.slice(0, MAX_HANDLE_LENGTH));

	if (seed.length > MAX_HANDLE_LENGTH) {
		addCandidate(seed.slice(-MAX_HANDLE_LENGTH));
		const tailLength = 4;
		addCandidate(
			`${seed.slice(0, MAX_HANDLE_LENGTH - tailLength)}${seed.slice(-tailLength)}`,
		);
	}

	const checksum = createHandleChecksum(userId);
	addCandidate(
		`${seed.slice(0, MAX_HANDLE_LENGTH - checksum.length)}${checksum}`,
	);

	if (candidates.length === 0) {
		addCandidate(`user${checksum}`.slice(0, MAX_HANDLE_LENGTH));
	}

	return candidates;
};

export const createDisplayHandle = ({
	handle,
	name,
	userId,
}: CreateDisplayHandleParams): string => {
	const normalizedHandle = parseUserHandle(handle);
	if (normalizedHandle) {
		return `@${normalizedHandle}`;
	}

	const normalizedName = sanitizeHandleSeed(name);
	if (normalizedName) {
		return `@${normalizedName.slice(0, MAX_HANDLE_LENGTH)}`;
	}

	const normalizedId = sanitizeHandleSeed(userId);
	if (normalizedId) {
		return `@${normalizedId.slice(0, MAX_HANDLE_LENGTH)}`;
	}

	return "@Numatter";
};

const sanitizeHandleSeed = (value: string | null | undefined): string => {
	if (!value) {
		return "";
	}

	return value
		.toLowerCase()
		.replace(/[^a-z0-9_]+/g, "")
		.replace(/^_+|_+$/g, "");
};

const createHandleChecksum = (value: string): string => {
	let sum = 0;

	for (const char of value) {
		sum = (sum * 31 + char.charCodeAt(0)) % 1_679_616;
	}

	return sum.toString(36).padStart(4, "0").slice(0, 4);
};
