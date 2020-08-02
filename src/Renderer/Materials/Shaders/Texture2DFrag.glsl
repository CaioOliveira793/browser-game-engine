#version 300 es
precision mediump float;

in vec2 v_TextureCoord;

uniform sampler2D u_Texture;


out vec4 out_Color;

void main() {
	out_Color = texture(u_Texture, v_TextureCoord);
}
