import { mat4 as Mat4, vec3 as Vec3, glMatrix } from 'gl-matrix';


export class OrthographicCamera {
	private projectionMatrix = Mat4.create();
	private viewMatrix = Mat4.create();
	private viewProjectionMatrix = Mat4.create();

	private position = Vec3.create();
	private rotation = Vec3.create();

	private width: number;
	private zoomLevel: number;
	private aspectRatio: number;

	constructor(width: number, aspectRatio: number, zoomLevel?: number) {
		this.width = width;
		this.aspectRatio = aspectRatio;
		this.zoomLevel = zoomLevel ?? width;
		Mat4.ortho(this.projectionMatrix,
			-this.aspectRatio * this.width,
			this.aspectRatio * this.width,
			-this.width,
			this.width,
			-this.zoomLevel,
			this.zoomLevel);

		Mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}

	public getViewProjectionMatrix = (): Mat4 => this.viewProjectionMatrix;

	public getPosition = (): Vec3 => this.position;
	public setPosition = (position: Vec3): void => {
		this.position[0] = position[0];
		this.position[1] = position[1];
		this.position[2] = position[2];

		this.calculateViewMatrix();
	}
	public setPositionX = (x: number): void => {
		this.position[0] = x;
		this.calculateViewMatrix();
	}
	public setPositionY = (y: number): void => {
		this.position[1] = y;
		this.calculateViewMatrix();
	}
	public setPositionZ = (z: number): void => {
		this.position[2] = z;
		this.calculateViewMatrix();
	}

	public getRotation = (): Vec3 => this.rotation;
	public setRotation = (angle: Vec3): void => {
		this.rotation[0] = angle[0];
		this.rotation[1] = angle[1];
		this.rotation[2] = angle[2];

		this.calculateViewMatrix();
	}
	public setRotationX = (x: number): void => {
		this.rotation[0] = x;
		this.calculateViewMatrix();
	}
	public setRotationY = (y: number): void => {
		this.rotation[1] = y;
		this.calculateViewMatrix();
	}
	public setRotationZ = (z: number): void => {
		this.rotation[2] = z;
		this.calculateViewMatrix();
	}

	public setAspectRatio = (aspectRatio: number): void => {
		this.aspectRatio = aspectRatio;
		Mat4.ortho(this.projectionMatrix,
			-this.aspectRatio * this.width,
			this.aspectRatio * this.width,
			-this.width,
			this.width,
			-this.zoomLevel,
			this.zoomLevel);

		Mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}


	private calculateViewMatrix = (): void => {
		const transform = Mat4.create();

		Mat4.translate(transform, Mat4.create(), this.position);
		Mat4.rotateX(transform, transform, glMatrix.toRadian(this.rotation[0]));
		Mat4.rotateY(transform, transform, glMatrix.toRadian(this.rotation[1]));
		Mat4.rotateZ(transform, transform, glMatrix.toRadian(this.rotation[2]));
		Mat4.invert(this.viewMatrix, transform);

		Mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}
}


export class PerspectiveCamera {
	private projectionMatrix = Mat4.create();
	private viewMatrix = Mat4.create();
	private viewProjectionMatrix = Mat4.create();

	private position = Vec3.create();
	private rotation = Vec3.create();

	private fieldOfView: number;
	private near: number;
	private far: number;
	private aspectRatio: number;

	constructor(fieldOfView: number, near: number, far: number, aspectRatio: number) {
		this.fieldOfView = fieldOfView;
		this.near = near;
		this.far = far;
		this.aspectRatio = aspectRatio;

		Mat4.perspective(this.projectionMatrix,
			glMatrix.toRadian(this.fieldOfView),
			this.aspectRatio,
			this.near,
			this.far);
	}

	public getViewProjectionMatrix = (): Mat4 => this.viewProjectionMatrix;

	public getPosition = (): Vec3 => this.position;
	public setPosition = (position: Vec3): void => {
		this.position[0] = position[0];
		this.position[1] = position[1];
		this.position[2] = position[2];

		this.calculateViewMatrix();
	}
	public setPositionX = (x: number): void => {
		this.position[0] = x;
		this.calculateViewMatrix();
	}
	public setPositionY = (y: number): void => {
		this.position[1] = y;
		this.calculateViewMatrix();
	}
	public setPositionZ = (z: number): void => {
		this.position[2] = z;
		this.calculateViewMatrix();
	}

	public getRotation = (): Vec3 => this.rotation;
	public setRotation = (angle: Vec3): void => {
		this.rotation[0] = angle[0];
		this.rotation[1] = angle[1];
		this.rotation[2] = angle[2];

		this.calculateViewMatrix();
	}
	public setRotationX = (x: number): void => {
		this.rotation[0] = x;
		this.calculateViewMatrix();
	}
	public setRotationY = (y: number): void => {
		this.rotation[1] = y;
		this.calculateViewMatrix();
	}
	public setRotationZ = (z: number): void => {
		this.rotation[2] = z;
		this.calculateViewMatrix();
	}

	public setAspectRatio = (aspectRatio: number): void => {
		this.aspectRatio = aspectRatio;
		Mat4.perspective(this.projectionMatrix,
			glMatrix.toRadian(this.fieldOfView),
			this.aspectRatio,
			this.near,
			this.far);

		Mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}


	private calculateViewMatrix = (): void => {
		const transform = Mat4.create();

		Mat4.translate(transform, Mat4.create(), this.position);
		Mat4.rotateX(transform, transform, glMatrix.toRadian(this.rotation[0]));
		Mat4.rotateY(transform, transform, glMatrix.toRadian(this.rotation[1]));
		Mat4.rotateZ(transform, transform, glMatrix.toRadian(this.rotation[2]));
		Mat4.invert(this.viewMatrix, transform);

		Mat4.multiply(this.viewProjectionMatrix, this.projectionMatrix, this.viewMatrix);
	}
}
