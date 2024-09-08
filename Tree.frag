#ifdef GL_ES
precision mediump float;
#endif

const float PI = 3.1415926535;

uniform vec2 u_resolution;

float polygonshape(vec2 position, float radius, float sides){
	position = position * 2.0 - 1.0;
	float angle = atan(position.x, position.y);
	float slice = PI * 2.0 / sides;

	return step(radius, cos(floor(0.5 + angle / slice) * slice - angle) * length(position));
}

void main(){
	vec2 position = gl_FragCoord.xy / u_resolution;

	vec3 color = vec3(1.0);

	float triangle1 = polygonshape(vec2(position.x, 1.4-position.y), 0.05, 3.0);
	float triangle2 = polygonshape(vec2(position.x, 1.28-position.y), 0.1, 3.0);
	float triangle3 = polygonshape(vec2(position.x, 1.17-position.y), 0.15, 3.0);
	float triangle4 = polygonshape(vec2(position.x, 1.05-position.y), 0.2, 3.0);
	float triangle5 = polygonshape(vec2(position.x, 0.95-position.y), 0.25, 3.0);

    vec4 rect = step(vec4(0.45, 0.25, 0.45, 0.5), vec4(position.x, position.y, 1.0-position.x, 1.0-position.y));

	color = vec3(triangle1);
    color *= vec3(triangle2);
    color *= vec3(triangle3);
    color *= vec3(triangle4);
    color *= vec3(triangle5);
	color *= vec3(1.0 - rect.x * rect.y * rect.z * rect.w);
	color += vec3(0.0314, 0.0549, 0.1137);

	//color += sin(position.x * 6.0 + sin(position.y * 90.0 + cos(position.x * 30.0* 2.0))) * 0.5;

	gl_FragColor = vec4(color, 1.0);
}