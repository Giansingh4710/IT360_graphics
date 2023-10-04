// https://openprocessing.org/sketch/2031216
let vs = `
  precision highp float;

  attribute vec3 aPosition;

  void main() {
     vec4 positionVec4 = vec4(aPosition, 1.0);
     gl_Position = positionVec4;
}
`;
let fs = `
  precision highp float;

  uniform vec2 resolution;
	uniform vec3 CameraPosition;
	uniform vec2 XYRot;
	uniform vec4 Light;
	uniform float debugBounce;
	uniform sampler2D SkyTexture;
	
	struct Ray 
	{
		vec3 origin;
		vec3 direction;
		vec3 energy;
	};
	Ray newRay(vec3 origin, vec3 direction)
	{
		Ray ray;
		ray.origin = origin;
		ray.direction = direction;
		ray.energy = vec3(1.0,1.0,1.0);
		return ray;
	}
	struct Hit 
	{
		float distance;
		vec3 point;
		vec3 normal;
		vec3 colour;
		float specularity;
	};
	Hit newHit()
	{
		Hit hit;
		hit.distance = 100.0;
		hit.point = vec3(0.0,0.0,0.0);
		hit.normal = vec3(0.0,0.0,0.0);
		hit.colour = vec3(0.0,0.0,0.0);
		hit.specularity = 0.0;
		return hit;
	}
	Ray CameraRay(vec2 uvCoord)
	{
			vec3 origin = CameraPosition.xyz; //cameras position
			vec3 direction = normalize(vec3(uvCoord.x, uvCoord.y, -1.0));

			float rotX = ((XYRot.y/360.0)-1.25) * 3.14*2.0;
			float rotY = ((XYRot.x/360.0)-1.25) * 3.14*2.0;
			vec2 uv = 2.5 * (uvCoord.xy - 0.5 * resolution.xy) / resolution.xx;
			vec3 camO = vec3(cos(rotX), cos(rotY), sin(rotX));
			vec3 camD = normalize(vec3(0)-camO);
			vec3 camR = normalize(cross(camD, vec3(0, 1, 0)));
			vec3 camU = cross(camR,camD);

			direction = normalize(uv.x * camR + uv.y * camU + camD);

			return newRay(origin, direction);
	}
	struct Sphere
	{
		vec3 position;
		float radius;
		vec3 colour;
		float specularity;
	};
	Sphere newSphere(vec3 position, float radius, vec3 colour, float sp)
	{
		Sphere s;
		s.position = position;
		s.radius = radius;
		s.colour = colour;
		s.specularity = sp;
		return s;
	}
	void IntersectSphere(Ray ray, inout Hit hit, Sphere sphere)
	{
		vec3 d = ray.origin - sphere.position;
		float p1 = -dot(ray.direction, d);
		float p2sqr = p1 * p1 - dot(d, d) + sphere.radius * sphere.radius;
		if (p2sqr < 0.0)
		{
			return;
		}
		float p2 = sqrt(p2sqr);
		float t = p1 - p2 > 0.0 ? p1 - p2 : p1 + p2;
		if (t > 0.0 && t < hit.distance)
		{
				hit.distance = t;
				hit.point = ray.origin + t * ray.direction;
				hit.normal = normalize(hit.point - sphere.position);
				hit.colour = sphere.colour;
				hit.specularity = sphere.specularity;
		}
	}
	void IntersectGround(Ray ray, inout Hit hit)
	{
			float t = -(ray.origin.y)/ray.direction.y;
			if (t > 0.0 && t < hit.distance)
			{
					hit.distance = t;
					hit.point = ray.origin + ray.direction*t;
					hit.normal = vec3(0,1,0);
					hit.colour = vec3(0.8, 0.8, 0.8);
					hit.specularity = 0.05;
			}
	}
	Hit IntersectRay(Ray ray)
	{
		Sphere tempSphere = newSphere(vec3(2.5,2.5,5), 2.0, vec3(0.2,0.2,0.2), 0.9);
		Sphere tempSphere0 = newSphere(vec3(0,0,0), 2.0, vec3(0.0,1.0,0.0), 0.01);
		Hit hit = newHit();
		IntersectSphere(ray, hit,tempSphere);
		IntersectSphere(ray, hit,tempSphere0);
		IntersectGround(ray, hit);
		return hit;
	}
	vec3 Skybox(vec3 dir)
	{
		float PI = 3.14159265;
		float theta = acos(dir.y) / PI;
		float phi = atan(dir.x / -dir.z) / -PI * 0.5;
		if (phi < 0.0)
			phi= abs(phi);
		vec4 c = texture2D(SkyTexture, vec2(phi, theta));
		return vec3(c.x,c.y,c.z);
	}
	vec3 ColourRayHit(inout Ray r, Hit h, inout bool breakL)
	{
		if (h.distance != 100.0)
		{
			Ray shadowRay = newRay(h.point + (h.normal*0.001), Light.xyz);
			Hit shadowH = IntersectRay(shadowRay);
			if (shadowH.distance == 100.0)
			{
				float d = dot(normalize(Light.xyz), h.normal) * Light.w;
				r.energy *= h.specularity;
				vec3 newDir = reflect(r.direction, h.normal);
				vec3 newO = h.point + (h.normal*0.001);
				r.direction = newDir;
				r.origin=newO;
				return h.colour*d;
			}
			else
			{
				//in shadow
				r.energy = vec3(0,0,0);
				breakL = true;
				return vec3(0,0,0);
			}
		}
		//didnt hit in the first place
		r.energy = vec3(0,0,0);
		breakL = true;
		//return sky colour
		vec3 skyCol = Skybox(r.direction);//vec3(0.85,0.95,1.0)*max(r.direction.y,0.5);
		return skyCol;
	}

  void main() {
    vec3 color;
		vec2 uv = vec2((gl_FragCoord.x - resolution.x/2.0) / resolution.x, (gl_FragCoord.y-resolution.y/2.0) / resolution.x);
		Ray viewRay = CameraRay(vec2(gl_FragCoord.x, gl_FragCoord.y));
		vec3 col = vec3(0,0,0);
		bool breakL = false;
		for (int i = 0; i < 10; i++)
		{
			Hit h = IntersectRay(viewRay);
			vec3 energy = viewRay.energy;
			col += energy*ColourRayHit(viewRay,h, breakL);
			if (breakL)
				break;
		}
		//col = vec3(XYRot.y/360.0,0,0);
    gl_FragColor = vec4(col,1);
}
`;

var sh;
var img;
function preload(){
	img = loadImage("snowpark.png");
}
function setup() {
	createCanvas(windowWidth, windowHeight, WEBGL);
	background(100);
	sh = createShader(vs,fs);
}


var cameraTransform = new Transform([0,0,0],[0,0,0],[0,0,0]);
var light = [0,1,-0.7,1];
var t = 0;
var rotSpeed = 1.5;
var moveSpeed = 0.2;
function draw() {
	t++;
	//move camera
	var move = Input.GetRelativeMovement(cameraTransform, moveSpeed, "a", "d", " ", "Shift", "w", "s");
	cameraTransform.Translate(move);
	cameraTransform.Rotate([Input.GetAxis("ArrowUp", "ArrowDown")*-rotSpeed,Input.GetAxis("ArrowRight", "ArrowLeft")*rotSpeed,0]);
	shader(sh);
	sh.setUniform("SkyTexture", img);
	sh.setUniform("resolution", [width,height]);
	sh.setUniform("CameraPosition", cameraTransform.position);
	sh.setUniform("XYRot", [cameraTransform.rotation[0], cameraTransform.rotation[1]]);
	sh.setUniform("Light", light);
	sh.setUniform("debugBounce", Math.abs(Math.sin(t*0.05)*6)+1.5);
	quad(-1, -1, -1, 1, 1, 1, 1, -1);
	resetShader(sh);
}
