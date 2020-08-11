export const enum ShaderDataType {
	None = 0,
	Float,
	Float2,
	Float3,
	Float4,
	Int,
	Int2,
	Int3,
	Int4,
	Mat3,
	Mat4,
	Bool
}

export function shaderDataTypeToSize(type: ShaderDataType): number {
	switch (type) {
		case ShaderDataType.Float:      return 4;
		case ShaderDataType.Float2:     return 4 * 2;
		case ShaderDataType.Float3:     return 4 * 3;
		case ShaderDataType.Float4:     return 4 * 4;
		case ShaderDataType.Int:        return 4;
		case ShaderDataType.Int2:       return 4 * 2;
		case ShaderDataType.Int3:       return 4 * 3;
		case ShaderDataType.Int4:       return 4 * 4;
		case ShaderDataType.Mat3:       return 4 * 3 * 3;
		case ShaderDataType.Mat4:       return 4 * 4 * 4;
		case ShaderDataType.Bool:       return 1;
	}

	return 0;
}

function shaderDataTypeTocomponentCount(type: ShaderDataType): number {
	switch (type) {
		case ShaderDataType.Float:   return 1;
		case ShaderDataType.Float2:  return 2;
		case ShaderDataType.Float3:  return 3;
		case ShaderDataType.Float4:  return 4;
		case ShaderDataType.Mat3:    return 3; // * float3
		case ShaderDataType.Mat4:    return 4; // * float4
		case ShaderDataType.Int:     return 1;
		case ShaderDataType.Int2:    return 2;
		case ShaderDataType.Int3:    return 3;
		case ShaderDataType.Int4:    return 4;
		case ShaderDataType.Bool:    return 1;
	}

	return 0;
}


export interface BufferElement {
	readonly type: ShaderDataType;
	readonly normalized: boolean;
	readonly size: number;
	readonly offset: number;
	readonly componentCount: number;
}

export class BufferLayout extends Array<BufferElement> {
	public readonly stride: number;

	constructor(elements: { type: ShaderDataType, normalized?: boolean }[]) {
		super(elements.length);
		let offset = 0;
		let stride = 0;

		elements.forEach(element => {
			const size = shaderDataTypeToSize(element.type);

			super.push({
				type: element.type,
				normalized: !!element.normalized,
				componentCount: shaderDataTypeTocomponentCount(element.type),
				size,
				offset
			});

			offset += size;
			stride += size;
		});

		this.stride = stride;
	}
}


export default BufferLayout;
