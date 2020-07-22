#version 300 es
precision mediump float;

uniform ub_Material {
	vec4 Color;
};

out vec4 out_Color;


void main() {
	out_Color = Color;
}
