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

export class BufferElement {
	public type: ShaderDataType;
	public name: string;
	public size: number;
	public offset: number;
	public normalized: boolean;

	constructor(type: ShaderDataType, name: string, normalized = false) {
		this.type = type;
		this.name = name;
		this.normalized = normalized;
		this.offset = 0;
		this.size = shaderDataTypeToSize(type);
	}

	public getComponentCount = (): number => {
		switch (this.type) {
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
}


export class BufferLayout {
	private elements: BufferElement[];
	private stride: number;

	constructor(elements: BufferElement[]) {
		this.elements = elements;

		let offset = 0;
		this.stride = 0;

		this.elements.forEach(element => {
			element.offset = offset;
			offset += element.size;
			this.stride += element.size;
		});
	}

	public getElements = (): BufferElement[] => this.elements;
	public getStride = (): number => this.stride;
}


export default BufferLayout;
