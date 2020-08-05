#vertex
#version 300 es
precision mediump float;

#define MAX_GEOMETRY 1

layout(location = 0) in vec4 a_Position;
layout(location = 1) in vec2 a_TextureCoord;
layout(location = 2) in float a_GeometryIndex;

uniform ub_Scene {
	mat4 viewProjection;
};

uniform mat4 u_Transform[MAX_GEOMETRY];


out vec2 v_TextureCoord;
out float v_GeometryIndex;

void main() {
	v_TextureCoord = a_TextureCoord;
	v_GeometryIndex = a_GeometryIndex;
	gl_Position = viewProjection * u_Transform[int(a_GeometryIndex)] * a_Position;
}

#fragment
#version 300 es
precision mediump float;

#define MAX_GEOMETRY 1
#define MAX_SAMPLERS_2D 8

in vec2 v_TextureCoord;
in float v_GeometryIndex;

struct Material {
	vec4 color;
	int textureIndex;
	float tilingFactor;
};

uniform ub_Material {
	Material material[MAX_GEOMETRY];
};

uniform sampler2D u_Texture[MAX_SAMPLERS_2D];


out vec4 out_Color;

void main() {
	int gi = int(v_GeometryIndex);
	vec4 texColor = material[gi].color;

	switch (material[gi].textureIndex) {
		case 0: texColor *= texture(u_Texture[0], v_TextureCoord * material[gi].tilingFactor); break;
		case 1: texColor *= texture(u_Texture[1], v_TextureCoord * material[gi].tilingFactor); break;
		case 2: texColor *= texture(u_Texture[2], v_TextureCoord * material[gi].tilingFactor); break;
		case 3: texColor *= texture(u_Texture[3], v_TextureCoord * material[gi].tilingFactor); break;
		case 4: texColor *= texture(u_Texture[4], v_TextureCoord * material[gi].tilingFactor); break;
		case 5: texColor *= texture(u_Texture[5], v_TextureCoord * material[gi].tilingFactor); break;
		case 6: texColor *= texture(u_Texture[6], v_TextureCoord * material[gi].tilingFactor); break;
		case 7: texColor *= texture(u_Texture[7], v_TextureCoord * material[gi].tilingFactor); break;
	}

	out_Color = texColor;
}
