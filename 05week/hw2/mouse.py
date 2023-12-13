import glfw
from OpenGL.GL import *
import math

# Constants
circle_radius = 0.1
circle_color = (0.807, 0.0, 0.0)
background_color = (0.870, 0.905, 0.937)

# Global variables for circle positions
circle1_x = -0.5
circle2_x = 0.5
circle1_y = 0.0
circle2_y = 0.0

# Global variables to track mouse interaction
is_dragging = False
dragged_circle = None
click_offset_x = 0.0

# Callback for mouse button events
def mouse_button_callback(window, button, action, mods):
    global is_dragging, dragged_circle, click_offset_x

    if button == glfw.MOUSE_BUTTON_LEFT:
        x, y = glfw.get_cursor_pos(window)
        normalized_x = x / 640.0 * 2.0 - 1.0
        normalized_y = 1.0 - y / 480.0 * 2.0

        if action == glfw.PRESS:
            if is_within_circle(normalized_x, normalized_y, circle1_x, circle1_y, circle_radius):
                is_dragging = True
                dragged_circle = "circle1"
                click_offset_x = normalized_x - circle1_x
            elif is_within_circle(normalized_x, normalized_y, circle2_x, circle2_y, circle_radius):
                is_dragging = True
                dragged_circle = "circle2"
                click_offset_x = normalized_x - circle2_x
        elif action == glfw.RELEASE:
            is_dragging = False

# Callback for cursor position (used to drag circles)
def cursor_position_callback(window, xpos, ypos):
    global is_dragging, circle1_x, circle2_x, circle1_y,circle2_y, click_offset_x

    if is_dragging:
        x = xpos / 640.0 * 2.0 - 1.0
        y = 1.0 - ypos / 480.0 * 2.0
        if dragged_circle == "circle1":
            circle1_x = x - click_offset_x
            circle1_y = y 
        elif dragged_circle == "circle2":
            circle2_x = x - click_offset_x
            circle2_y = y 

# Function to check if a point is within a circle
def is_within_circle(x, y, circle_x, circle_y, radius):
    a = (x - circle_x) ** 2 + (y - circle_y) ** 2 
    b = (radius+1) ** 2
    print(a, b) 
    return a <= b

# Initialize the library
if not glfw.init():
    exit()

# Create a windowed mode window and its OpenGL context
window = glfw.create_window(640, 480, "Mouse Control", None, None)
if not window:
    glfw.terminate()
    exit()

# Make the window's context current
glfw.make_context_current(window)

# Set callbacks
glfw.set_mouse_button_callback(window, mouse_button_callback)
glfw.set_cursor_pos_callback(window, cursor_position_callback)

# Main loop
while not glfw.window_should_close(window):
    # Clear the screen with the background color
    glClearColor(*background_color, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)

    # Draw the first circle
    glColor3f(*circle_color)
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(circle1_x, circle1_y)
    for i in range(360):
        angle = math.radians(i)
        x = circle1_x + circle_radius * math.cos(angle)
        y = circle1_y + circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    # Draw the second circle
    glColor3f(*circle_color)
    glBegin(GL_TRIANGLE_FAN)
    glVertex2f(circle2_x, circle2_y)
    for i in range(360):
        angle = math.radians(i)
        x = circle2_x + circle_radius * math.cos(angle)
        y = circle2_y + circle_radius * math.sin(angle)
        glVertex2f(x, y)
    glEnd()

    # Swap front and back buffers
    glfw.swap_buffers(window)

    # Poll for and process events
    glfw.poll_events()

# Terminate GLFW
glfw.terminate()
