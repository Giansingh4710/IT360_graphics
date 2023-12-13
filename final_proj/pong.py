import pygame
from pygame.locals import *
from OpenGL.GL import *
from OpenGL.GLUT import *

# Initialize Pygame
pygame.init()

# Set up the window
width, height = 800, 600
pygame.display.set_mode((width, height), DOUBLEBUF | OPENGL)
glOrtho(0, width, height, 0, -1, 1)

# Paddle dimensions
paddle_width, paddle_height = 20, 100

# Ball dimensions
ball_size = 15

# Paddle positions
left_paddle_pos = [50, height // 2 - paddle_height // 2]
right_paddle_pos = [width - 50 - paddle_width, height // 2 - paddle_height // 2]

# Ball position and velocity
ball_pos = [width // 2, height // 2]
ball_vel = [4, 4]

# Main game loop
while True:
    for event in pygame.event.get():
        if event.type == pygame.QUIT:
            pygame.quit()
            quit()

    keys = pygame.key.get_pressed()
    # Move paddles
    if keys[pygame.K_w] and left_paddle_pos[1] > 0:
        left_paddle_pos[1] -= 5
    if keys[pygame.K_s] and left_paddle_pos[1] < height - paddle_height:
        left_paddle_pos[1] += 5
    if keys[pygame.K_UP] and right_paddle_pos[1] > 0:
        right_paddle_pos[1] -= 5
    if keys[pygame.K_DOWN] and right_paddle_pos[1] < height - paddle_height:
        right_paddle_pos[1] += 5

    # Update ball position
    ball_pos[0] += ball_vel[0]
    ball_pos[1] += ball_vel[1]

    # Bounce off walls
    if ball_pos[1] < 0 or ball_pos[1] > height - ball_size:
        ball_vel[1] = -ball_vel[1]

    # Bounce off paddles
    if (
        left_paddle_pos[0] < ball_pos[0] < left_paddle_pos[0] + paddle_width
        and left_paddle_pos[1] < ball_pos[1] < left_paddle_pos[1] + paddle_height
    ) or (
        right_paddle_pos[0] < ball_pos[0] < right_paddle_pos[0] + paddle_width
        and right_paddle_pos[1] < ball_pos[1] < right_paddle_pos[1] + paddle_height
    ):
        ball_vel[0] = -ball_vel[0]

    # Check for scoring
    if ball_pos[0] < 0 or ball_pos[0] > width:
        ball_pos = [width // 2, height // 2]

    # Clear the screen
    glClear(GL_COLOR_BUFFER_BIT)

    # Draw paddles and ball
    glBegin(GL_QUADS)
    glVertex2fv(left_paddle_pos)
    glVertex2fv([left_paddle_pos[0] + paddle_width, left_paddle_pos[1]])
    glVertex2fv([left_paddle_pos[0] + paddle_width, left_paddle_pos[1] + paddle_height])
    glVertex2fv([left_paddle_pos[0], left_paddle_pos[1] + paddle_height])

    glVertex2fv(right_paddle_pos)
    glVertex2fv([right_paddle_pos[0] + paddle_width, right_paddle_pos[1]])
    glVertex2fv(
        [right_paddle_pos[0] + paddle_width, right_paddle_pos[1] + paddle_height]
    )
    glVertex2fv([right_paddle_pos[0], right_paddle_pos[1] + paddle_height])

    glVertex2fv([ball_pos[0], ball_pos[1]])
    glVertex2fv([ball_pos[0] + ball_size, ball_pos[1]])
    glVertex2fv([ball_pos[0] + ball_size, ball_pos[1] + ball_size])
    glVertex2fv([ball_pos[0], ball_pos[1] + ball_size])
    glEnd()

    # Swap buffers
    pygame.display.flip()
    pygame.time.Clock().tick(60)
