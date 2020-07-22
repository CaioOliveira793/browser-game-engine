import Shader, { UniformBlockInfo } from './Shader';
import UniformBuffer from './UniformBuffer';


export class Material {
	public readonly shader: Shader;
	public readonly materialInfo: UniformBlockInfo;

	constructor(shader: Shader) {
		this.shader = shader;
		this.materialInfo = this.shader.getUniformBlocksInfo().get('ub_material') as UniformBlockInfo;
	}
}


export class MaterialInstance {
	private material: Material;

	private buffer: ArrayBuffer;
	private uniformBuffer: UniformBuffer;

	constructor(material: Material) {
		this.material = material;
		this.buffer = new ArrayBuffer(this.material.materialInfo.size);
		this.uniformBuffer = new UniformBuffer(this.material.materialInfo.size);
	}

	public set = (name: string, buffer: ArrayLike<number>): void => {
		const offset = this.material.materialInfo.uniforms.get(name)?.offset;
		// may not work when the buffer is setted with a different type
		(new Float32Array(this.buffer)).set(buffer, offset);
	}

	public upload = (): void => {
		this.material.shader.bind();
		this.material.shader.uploadUniformBuffer('ub_Material', this.uniformBuffer);
	}
}

export default Material;
