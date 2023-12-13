import glfw
from OpenGL.GL import *


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
        
# Initialize the library
if not glfw.init():
    exit()

# Create a windowed mode window and its OpenGL context
window = glfw.create_window(640, 480, "White Square on Black Background", None, None)
if not window:
    glfw.terminate()
    exit()

# Make the window's context current
glfw.make_context_current(window)

# Set callbacks
glfw.set_mouse_button_callback(window, mouse_button_callback)
glfw.set_key_callback(window, key_callback)

# Main loop
while not glfw.window_should_close(window):
    # Clear the screen with black color
    glClearColor(0.0, 0.0, 0.0, 1.0)
    glClear(GL_COLOR_BUFFER_BIT)

    # Draw a white square
    glColor3f(1.0, 1.0, 1.0)  # Set color to white
    glBegin(GL_QUADS)
    glVertex2f(-0.5, -0.5)
    glVertex2f(0.5, -0.5)
    glVertex2f(0.5, 0.5)
    glVertex2f(-0.5, 0.5)
    glEnd()

    # Swap front and back buffers
    glfw.swap_buffers(window)

    # Poll for and process events
    glfw.poll_events()

# Terminate GLFW
glfw.terminate()