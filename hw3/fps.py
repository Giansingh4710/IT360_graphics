import glfw
import math
import random
import time
from OpenGL.GL import *

TIMESTEP = 0.025

BOUNDARY_X = 0.5
BOUNDARY_Y = 0.5
MAX_MOVEMENT = 0.05
CIRCLE_RADIUS = 0.05
AGENT_SIZE = CIRCLE_RADIUS * 2
NUM_CIRCLES = 50
MAX_FORCE = 0.01
MAX_SPEED = 0.008

last_timestamp = time.time_ns()
frames = 0
total_time = 0
update_time = 0
update_frames = 0
previous_fps = 0
previous_avg_fps = 0

current_fps = 0.0
average_fps = 0.0


def mouse_button_callback(window, button, action, mods):
    x, y = glfw.get_cursor_pos(window)
    if button == glfw.MOUSE_BUTTON_LEFT and action == glfw.PRESS:
        print(f"Mouse click at ({x}, {y})")
    elif button == glfw.MOUSE_BUTTON_LEFT and action == glfw.RELEASE:
        print("Left mouse button released!")
    elif button == glfw.MOUSE_BUTTON_RIGHT and action == glfw.PRESS:
        print("Right mouse button pressed!")
    elif button == glfw.MOUSE_BUTTON_RIGHT and action == glfw.RELEASE:
        print("Right mouse button released!")


def key_callback(window, key, scancode, action, mods):
    if action == glfw.PRESS:
        if key == glfw.KEY_ESCAPE:
            print("Escape key pressed!")
            glfw.set_window_should_close(window, True)
        elif key == glfw.KEY_A:
            print("A key pressed!")
        elif key == glfw.KEY_B:
            print("B key pressed!")


if not glfw.init():
    exit()

window = glfw.create_window(
    800, 800, "FPS Counter", None, None
)
if not window:
    glfw.terminate()
    exit()

glfw.make_context_current(window)
glfw.set_mouse_button_callback(window, mouse_button_callback)
glfw.set_key_callback(window, key_callback)

circles = []

for i in range(NUM_CIRCLES):
    circle = {
        "x": random.uniform(-BOUNDARY_X, BOUNDARY_X),
        "y": random.uniform(-BOUNDARY_Y, BOUNDARY_Y),
        "v_x": random.uniform(-MAX_MOVEMENT, MAX_MOVEMENT),
        "v_y": random.uniform(-MAX_MOVEMENT, MAX_MOVEMENT),
        "v_x_goal": random.uniform(-MAX_MOVEMENT, MAX_MOVEMENT),
        "v_y_goal": random.uniform(-MAX_MOVEMENT, MAX_MOVEMENT),
    }
    circles.append(circle)


def calculate_distance(x1, y1, x2, y2):
    return math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)


def update_circles():
    for i in range(NUM_CIRCLES):
        circle = circles[i]
        circle["x"] += circle["v_x"]
        circle["y"] += circle["v_y"]

        if circle["x"] < -BOUNDARY_X:
            circle["x"] = BOUNDARY_X
        if circle["y"] < -BOUNDARY_Y:
            circle["y"] = BOUNDARY_Y
        if circle["x"] > BOUNDARY_X:
            circle["x"] = -BOUNDARY_X
        if circle["y"] > BOUNDARY_Y:
            circle["y"] = -BOUNDARY_Y

        vx = circle["v_x"]
        vy = circle["v_y"]
        zeta = 1.0023
        f_goal_x = (circle["v_x_goal"] - vx) / zeta
        f_goal_y = (circle["v_x_goal"] - vy) / zeta
        favoid_x = 0
        favoid_y = 0
        favoid_counter = 0

        for j in range(NUM_CIRCLES):
            if i == j:
                continue

            circle1 = circles[i]
            circle2 = circles[j]
            distance = calculate_distance(
                circle1["x"], circle1["y"], circle2["x"], circle2["y"]
            )

            if 0 < distance < AGENT_SIZE * 1.5:
                d_circle = max(distance - AGENT_SIZE, 0.001)
                k = 0.75 * max(AGENT_SIZE * 3 - d_circle, 0)
                x_ab = (circle1["x"] - circle2["x"]) / distance
                y_ab = (circle1["y"] - circle2["y"]) / distance
                favoid_x += k * x_ab / d_circle
                favoid_y += k * y_ab / d_circle
                favoid_counter += 1

        if favoid_counter > 0:
            favoid_x /= favoid_counter
            favoid_y /= favoid_counter

        force_sum_x = f_goal_x + favoid_x
        force_sum_y = f_goal_y + favoid_y
        f_avoid_mag = math.sqrt(force_sum_x**2 + force_sum_y**2)

        if f_avoid_mag > MAX_FORCE:
            force_sum_x = MAX_FORCE * force_sum_x / f_avoid_mag
            force_sum_y = MAX_FORCE * force_sum_y / f_avoid_mag

        vx += TIMESTEP * force_sum_x
        vy += TIMESTEP * force_sum_y
        speed = math.sqrt(vx**2 + vy**2)

        if speed > MAX_SPEED:
            vx = MAX_SPEED * vx / speed
            vy = MAX_SPEED * vy / speed

        circle["v_x"] = vx
        circle["v_y"] = vy
        circle["x"] += TIMESTEP * vx
        circle["y"] += TIMESTEP * vy


def draw_circle(x, y, r, num_segments):
    glTranslatef(x, y, 0)

    glColor3f(0, 0, 1)
    glBegin(GL_LINE_LOOP)
    for i in range(num_segments):
        angle = 360 * i / num_segments
        cx = r * math.cos(angle)
        cy = r * math.sin(angle)
        glVertex2f(x + cx, y + cy)

    glEnd()

    glTranslatef(x, y, 0)

    glColor3f(0.807, 0, 1)
    glBegin(GL_TRIANGLE_FAN)
    for i in range(num_segments):
        angle = 2 * math.pi * i / num_segments
        cx = r * math.cos(angle)
        cy = r * math.sin(angle)
        glVertex2f(cx, cy)

    glEnd()


def get_fps():
    global last_timestamp, total_time, frames, update_time, update_frames, current_fps, average_fps

    now = time.time_ns()
    delta = now - last_timestamp
    last_timestamp = now
    total_time += delta
    update_time += delta
    frames += 1
    update_frames += 1

    if update_time > 1000000000:
        current_fps = 1000000000
        current_fps = 1000000000 * frames / total_time
        average_fps = 1000000000 * update_frames / update_time
        update_time = 0
        update_frames = 0

    return average_fps, current_fps


while not glfw.window_should_close(window):
    glClearColor(0.870, 0.905, 0.937, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)
    time.sleep(TIMESTEP)
    update_circles()

    for circle in circles:
        glPushMatrix()
        draw_circle(circle["x"], circle["y"], CIRCLE_RADIUS, 1000)
        glPopMatrix()

    current_avg_fps, overall_avg_fps = get_fps()
    current_avg_fps = round(current_avg_fps)
    overall_avg_fps = round(overall_avg_fps)

    if previous_fps != current_avg_fps:
        print(f"Current FPS: {current_avg_fps}\nOverall FPS Average: {overall_avg_fps}")
        previous_fps = current_avg_fps

    glfw.swap_buffers(window)
    glfw.poll_events()

glfw.terminate()
