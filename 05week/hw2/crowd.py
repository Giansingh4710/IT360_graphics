import glfw
from OpenGL.GL import *
import math
import random

# Constants
circle_radius = 0.1
circle_color = (0.807, 0.0, 0.0)
background_color = (0.870, 0.905, 0.937)
num_circles = 50

# List to store circle positions and velocities
circle_positions = [(random.uniform(-1.0, 1.0), random.uniform(-1.0, 1.0)) for _ in range(num_circles)]
circle_velocities = [(random.uniform(-0.05, 0.05), random.uniform(-0.05, 0.05)) for _ in range(num_circles)]

# Callback for mouse button events
def mouse_button_callback(window, button, action, mods):
    pass

# Callback for cursor position (used to drag circles)
def cursor_position_callback(window, xpos, ypos):
    pass

# Function to update circle positions and check boundaries
def update_circle_positions():
    global circle_positions, circle_velocities

    for i in range(num_circles):
        x, y = circle_positions[i]
        velocity_x, velocity_y = circle_velocities[i]

        x += velocity_x
        y += velocity_y

        if x + circle_radius >= 1.0 or x - circle_radius <= -1.0:
            velocity_x = -velocity_x

        if y + circle_radius >= 1.0 or y - circle_radius <= -1.0:
            velocity_y = -velocity_y

        circle_positions[i] = (x, y)
        circle_velocities[i] = (velocity_x, velocity_y)

# Initialize the library
if not glfw.init():
    exit()

# Create a windowed mode window and its OpenGL context
window = glfw.create_window(640, 480, "Circle Crowd", None, None)
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

    # Update circle positions and check boundaries
    update_circle_positions()

    # Draw the circles in the crowd
    glColor3f(*circle_color)
    for x, y in circle_positions:
        glBegin(GL_TRIANGLE_FAN)
        glVertex2f(x, y)
        for i in range(360):
            angle = math.radians(i)
            circle_x = x + circle_radius * math.cos(angle)
            circle_y = y + circle_radius * math.sin(angle)
            glVertex2f(circle_x, circle_y)
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
