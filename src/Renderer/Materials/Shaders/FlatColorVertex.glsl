#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_Position;

uniform ub_Scene {
	mat4 ViewProjection;
};

uniform mat4 u_Transform;


void main() {
	gl_Position = ViewProjection * u_Transform * a_Position;
}
