uniform vec3 uSurfaceColor;
uniform vec3 uDepthColor;
uniform float uColorOffset;
uniform float uColorMultiplier;

varying float vElevation;

void main()
{
    float mixStrengh = (vElevation + uColorOffset) * uColorMultiplier;
    vec3 mixedColor = mix(uDepthColor, uSurfaceColor, mixStrengh);
    gl_FragColor = vec4(mixedColor, 1.0);

    #include <colorspace_fragment>
}