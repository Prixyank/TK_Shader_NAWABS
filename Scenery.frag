#ifdef GL_ES
precision mediump float;
#endif

uniform vec2 u_resolution;
uniform float u_time;
uniform vec2 u_mouse;

float edge(vec2 uv,vec2 p0,vec2 p1){
    return(uv.y-p0.y)*(p1.x-p0.x)-(uv.x-p0.x)*(p1.y-p0.y);
}

bool drawTree(vec2 uv,vec2 position,float scale){
    uv=(uv-position)/scale;// Apply scaling by dividing the uv
    
    vec2 p0=vec2(0.,.35);// Top of the tree (relative to position)
    vec2 p1=vec2(-.12,.12);// Left vertex of top triangle
    vec2 p2=vec2(.12,.12);// Right vertex of top triangle
    vec2 p7=(p1+p2)/2.;
    p7.y+=.07;
    
    vec2 p3=vec2(-.16,-.02);// Left vertex of middle triangle
    vec2 p4=vec2(.16,-.02);// Right vertex of middle triangle
    vec2 p8=(p3+p4)/2.;
    p8.y+=.06;
    
    vec2 p5=vec2(-.2,-.18);// Left vertex of bottom triangle
    vec2 p6=vec2(.2,-.18);// Right vertex of bottom triangle
    
    vec2 trunk_p0=vec2(-.03,-.35);// Bottom left of trunk
    vec2 trunk_p1=vec2(.03,-.122);// Top right of trunk
    
    float edge_top_1=edge(uv,p0,p1);// Left top
    float edge_top_3=edge(uv,p2,p0);// Right top
    float edge_top_2=edge(uv,p1,p2);// Bottom top
    
    float edge_mid_1=edge(uv,p7,p3);// Left mid
    float edge_mid_3=edge(uv,p4,p7);// Right mid
    float edge_mid_2=edge(uv,p3,p4);// Bottom mid
    
    float edge_bot_1=edge(uv,p8,p5);// Left bottom
    float edge_bot_3=edge(uv,p6,p8);// Right bottom
    float edge_bot_2=edge(uv,p5,p6);// Bottom bottom
    
    // Define the trunk as a rectangle
    bool in_trunk=(uv.x>trunk_p0.x&&uv.x<trunk_p1.x&&uv.y>trunk_p0.y&&uv.y<trunk_p1.y);
    
    // Return whether the pixel is inside any of the triangles or trunk
    return(edge_top_1>0.&&edge_top_2>0.&&edge_top_3>0.)||// Top triangle
    (edge_mid_1>0.&&edge_mid_2>0.&&edge_mid_3>0.)||// Middle triangle
    (edge_bot_1>0.&&edge_bot_2>0.&&edge_bot_3>0.)||// Bottom triangle
    in_trunk;
}

float noise(float x,float seed){
    return fract(sin(x*10.+seed)*50000.);
}

float perlinNoise(float x,float seed){
    float n=floor(x);
    float f=x-n;
    float v1=noise(n,seed);
    float v2=noise(n+1.,seed);
    return mix(v1,v2,f);
}

float mountainCurve(float x,float x_s,float y_s,float x_offset,float y_offset,float seed){
    float scaledX=(x-x_offset)*x_s;
    float base=pow(sin(scaledX*8.)*.75+.6,2.);
    float noiseValue=perlinNoise(scaledX*10.,seed)*.2;
    return base*y_s+noiseValue+y_offset;
}
void main(){
    vec2 uv=gl_FragCoord.xy/u_resolution.xy;
    
    // colors
    vec3 color=vec3(242,245,247)/255.;
    vec3 grey_blue_light=vec3(208,223,233)/255.;
    vec3 grey_blue=vec3(173,194,208)/255.;
    vec3 very_dark_grey_blue=vec3(30,50,63)/255.;
    vec3 dark_grey_blue=vec3(70,108,133)/255.;
    
    float y=mountainCurve(uv.x,1.6,.08,.3,.5,1.);
    if(uv.y<y)color=grey_blue_light;
    
    float y2=mountainCurve(uv.x,1.7,.1,.3,.4,1.7);
    if(uv.y<y2)color=grey_blue;
    
    // Tree 1
    if(drawTree(uv,vec2(.7,.50),.35)){
        color=dark_grey_blue*1.2;
    }
    // Tree 2
    if(drawTree(uv,vec2(.3,.5),0.4)){
        color=very_dark_grey_blue;
    }
    // Tree 3
    if(drawTree(uv,vec2(.82,.4),.45)){
        color=dark_grey_blue;
    }
    // Tree 4
    if(drawTree(uv,vec2(.21,.4),.5)){
        color=dark_grey_blue;
    }
    // Tree 5
    if(drawTree(uv,vec2(.12,.27),.62)){
        color=dark_grey_blue;
    }
    gl_FragColor=vec4(color,1.);
}