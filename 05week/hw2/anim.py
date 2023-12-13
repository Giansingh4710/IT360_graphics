import glfw
from OpenGL.GL import *
import math
import random

# Constants
circle_radius = 0.1
circle_color = (0.807, 0.0, 0.0)
background_color = (0.870, 0.905, 0.937)

# Global variables for circle positions and velocities
circle1_x = -0.5
circle2_x = 0.5
circle_y = 0.0
circle1_velocity = [0.05, 0.05]
circle2_velocity = [-0.05, -0.05]

def mouse_button_callback(window, button, action, mods):
    pass

def cursor_position_callback(window, xpos, ypos):
    pass

def is_within_circle(x, y, circle_x, circle_y, radius):
    return (x - circle_x) ** 2 + (y - circle_y) ** 2 <= radius ** 2

def update_circle_positions():
    global circle1_x, circle2_x, circle_y, circle1_velocity, circle2_velocity

    circle1_x += circle1_velocity[0]
    circle_y += circle1_velocity[1]
    
    if circle1_x + circle_radius >= 1.0 or circle1_x - circle_radius <= -1.0:
        circle1_velocity[0] = -circle1_velocity[0]
    
    if circle_y + circle_radius >= 1.0 or circle_y - circle_radius <= -1.0:
        circle1_velocity[1] = -circle1_velocity[1]

    circle2_x += circle2_velocity[0]
    circle_y += circle2_velocity[1]
    
    if circle2_x + circle_radius >= 1.0 or circle2_x - circle_radius <= -1.0:
        circle2_velocity[0] = -circle2_velocity[0]
    
    if circle_y + circle_radius >= 1.0 or circle_y - circle_radius <= -1.0:
        circle2_velocity[1] = -circle2_velocity[1]

if not glfw.init():
    exit()

window = glfw.create_window(640, 480, "Circle Animation", None, None)
if not window:
    glfw.terminate()
    exit()

glfw.make_context_current(window)

glfw.set_mouse_button_callback(window, mouse_button_callback)
glfw.set_cursor_pos_callback(window, cursor_position_callback)

while not glfw.window_should_close(window):
    glClearColor(*background_color, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)

    update_circle_positions()

    # Draw the first circle
    glColor3f(*circle_color)
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(circle1_x, circle_y)
    for i in range(360):
        angle = math.radians(i)
        x = circle1_x + circle_radius * math.cos(angle)
        y = circle_y + circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    # Draw the second circle
    glColor3f(*circle_color)
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(circle2_x, circle_y)
    for i in range(360):
        angle = math.radians(i)
        x = circle2_x + circle_radius * math.cos(angle)
        y = circle_y + circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    # Swap front and back buffers
    glfw.swap_buffers(window)

    # Poll for and process events
    glfw.poll_events()

    # Introduce a delay for animation
    glfw.poll_events()  # Poll events again to make the animation smoother
    glfw.wait_events_timeout(0.025)  # Wait for 25 milliseconds

# Terminate GLFW
glfw.terminate()
