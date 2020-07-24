import { glMatrix, vec3 as Vec3 } from 'gl-matrix';
import { OrthographicCamera } from './Camera';

import Input from '../Inputs/Input';
import Key from '../Inputs/KeyCodes';

import { ScreenResizeEvent } from '../Events/ScreenEvents';
import { MouseScrollEvent } from '../Events/MouseEvents';


export class OrthographicCameraController {
	private readonly camera: OrthographicCamera;

	private zoomLevel: number;
	private aspectRatio: number;

	private position = Vec3.fromValues(0, 0, 0);
	private rotation = Vec3.fromValues(0, 0, 0);

	private translationSpeed: number;
	private rotationSpeed: number;

	constructor(zoomLevel: number, aspectRatio: number) {
		this.zoomLevel = zoomLevel;
		this.aspectRatio = aspectRatio;
		this.camera = new OrthographicCamera(-this.aspectRatio * this.zoomLevel,
			this.aspectRatio * this.zoomLevel,
			-this.zoomLevel,
			this.zoomLevel,
			-this.zoomLevel,
			this.zoomLevel);

		this.translationSpeed = 100;
		this.rotationSpeed = 60;
	}

	public getCamera = (): OrthographicCamera => this.camera;

	public onUpdate = (deltaTime: number): void => {
		if (Input.isPressed(Key.UP)) {
			this.position[0] += -Math.sin(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
			this.position[1] += Math.cos(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
		} else if (Input.isPressed(Key.DOWN)) {
			this.position[0] -= -Math.sin(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
			this.position[1] -= Math.cos(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
		}
		if (Input.isPressed(Key.LEFT)) {
			this.position[0] -= Math.cos(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
			this.position[1] -= Math.sin(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
		} else if (Input.isPressed(Key.RIGHT)) {
			this.position[0] += Math.cos(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
			this.position[1] += Math.sin(glMatrix.toRadian(this.rotation[2])) * this.translationSpeed * deltaTime;
		}

		if (Input.isPressed(Key.Q))
			this.rotation[2] += this.rotationSpeed * deltaTime;
		if (Input.isPressed(Key.E))
			this.rotation[2] -= this.rotationSpeed * deltaTime;

		this.camera.setRotation(this.rotation);
		this.camera.setPosition(this.position);
	}

	public onScreenResize = (e: ScreenResizeEvent): void => {
		this.aspectRatio = e.width / e.height;
		this.camera.setViewProjection(-this.aspectRatio * this.zoomLevel,
			this.aspectRatio * this.zoomLevel,
			-this.zoomLevel,
			this.zoomLevel,
			-this.zoomLevel,
			this.zoomLevel);
	}

	public onMouseScroll = (e: MouseScrollEvent): void => {
		this.zoomLevel = Math.max(this.zoomLevel + e.delta, 1);
		this.camera.setViewProjection(-this.aspectRatio * this.zoomLevel,
			this.aspectRatio * this.zoomLevel,
			-this.zoomLevel,
			this.zoomLevel,
			-this.zoomLevel,
			this.zoomLevel);
	}
}

