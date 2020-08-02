#version 300 es
precision mediump float;

layout(location = 0) in vec4 a_Position;
layout(location = 1) in vec2 a_TexCoord;

uniform ub_Scene {
	mat4 ViewProjection;
};

uniform mat4 u_Transform;


out vec2 v_TextureCoord;

void main() {
	gl_Position = ViewProjection * u_Transform * a_Position;
	v_TextureCoord = a_TexCoord;
}
