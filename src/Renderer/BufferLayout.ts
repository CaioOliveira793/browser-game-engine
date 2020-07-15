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
	type: ShaderDataType;
	normalized: boolean;
	size: number;
	offset: number;
	componentCount: number;
}

export class BufferLayout {
	private elements: BufferElement[];
	private stride: number;

	constructor(elements: { type: ShaderDataType, normalized?: boolean }[]) {
		let offset = 0;
		this.stride = 0;

		this.elements = elements.map(element => {
			const size = shaderDataTypeToSize(element.type);

			const el = {
				type: element.type,
				normalized: !!element.normalized,
				componentCount: shaderDataTypeTocomponentCount(element.type),
				size,
				offset
			};

			offset += size;
			this.stride += size;

			return el;
		});
	}

	public getElements = (): BufferElement[] => this.elements;
	public getStride = (): number => this.stride;
}


export default BufferLayout;
