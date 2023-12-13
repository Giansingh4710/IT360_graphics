import glfw
from OpenGL.GL import *
from math import cos, sin, pi
import math

circle_radius = 0.2
circle_color = (0.807, 0.0, 0.0)

# Callback for mouse button events
def mouse_button_callback(window, button, action, mods):
    x, y = glfw.get_cursor_pos(window)
    if button == glfw.MOUSE_BUTTON_LEFT and action == glfw.PRESS:
        print(x,y)
        print("Left mouse button pressed!")
    elif button == glfw.MOUSE_BUTTON_LEFT and action == glfw.RELEASE:
        print("Left mouse button released!")
    elif button == glfw.MOUSE_BUTTON_RIGHT and action == glfw.PRESS:
        print("Right mouse button pressed!")
    elif button == glfw.MOUSE_BUTTON_RIGHT and action == glfw.RELEASE:
        print("Right mouse button released!")

# Callback for keyboard events
def key_callback(window, key, scancode, action, mods):
    if action == glfw.PRESS:
        if key == glfw.KEY_ESCAPE:
            print("Escape key pressed!")
            glfw.set_window_should_close(window, True)
        elif key == glfw.KEY_A:
            print("A key pressed!")
        elif key == glfw.KEY_B:
            print("B key pressed!")
        # ... add more keys as needed

def draw_rect():
    glColor3f(1.0, 1.0, 1.0)  # Set color to white
    glBegin(GL_QUADS)
    glVertex2f(-0.5, -0.5)
    glVertex2f(0.5, -0.5)
    glVertex2f(0.5, 0.5)
    glVertex2f(-0.5, 0.5)
    glEnd()

def draw_circle( radius, segments, color):
    x = 0
    glColor3f(*color)
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(x,x)
    for i in range(segments + 1):
        theta = 2.0 * pi * i / segments
        x = radius * cos(theta)
        y = radius * sin(theta)
        glVertex2f(x, y)
    glEnd()

if not glfw.init(): exit()

window = glfw.create_window(640, 480, "Circles", None, None)
if not window:
    glfw.terminate()
    exit()
glfw.make_context_current(window)
glfw.set_mouse_button_callback(window, mouse_button_callback)
glfw.set_key_callback(window, key_callback)

while not glfw.window_should_close(window):
    glClearColor(0.0, 0.0, 0.0, 1.0) # Clear the screen with black color
    glClear(GL_COLOR_BUFFER_BIT)
    
    # color = (0.807, 0.0, 0.0)
    # draw_circle(0.1, 200, color)

    # Draw the first circle
    glColor3f(*circle_color)  # Set fill color
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(-0.3, 0.0)  # Center of the first circle
    for i in range(360):
        angle = math.radians(i)
        x = -0.3 + circle_radius * math.cos(angle)
        y = circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    # Draw the second circle
    glColor3f(*circle_color)  # Set fill color
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(0.3, 0.0)  # Center of the second circle
    for i in range(360):
        angle = math.radians(i)
        x = 0.3 + circle_radius * math.cos(angle)
        y = circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    # Draw black boundaries
    glColor3f(0.0, 0.0, 0.0)  # Set boundary color
    glLineWidth(2.0)  # Set boundary line width

    glBegin(GL_LINE_LOOP)
    for i in range(360):
        angle = math.radians(i)
        x = -0.3 + circle_radius * math.cos(angle)
        y = circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    glBegin(GL_LINE_LOOP)
    for i in range(360):
        angle = math.radians(i)
        x = 0.3 + circle_radius * math.cos(angle)
        y = circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    glfw.swap_buffers(window)
    glfw.poll_events()

glfw.terminate()
