import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class CommentsService {
  constructor(private readonly prismaService: PrismaService) { }


  async validateInventoryandUser(inventoryId: string, userId: string) {
    const inventory = await this.prismaService.inventories.findUnique({
      where: { id: inventoryId }
    })
    if (!inventory) throw new NotFoundException("Inventory not found")
    const user = await this.prismaService.users.findUnique({
      where: { id: userId }
    })
    if (!user) throw new NotFoundException("User not found")
    return { inventory, user }
  }
  async create(createCommentDto: CreateCommentDto) {
    await this.validateInventoryandUser(createCommentDto.inventoryId, createCommentDto.userId)
    const newComment = await this.prismaService.comments.create({
      data: createCommentDto
    })
    return newComment
  }


  async findOne(inventoryId: string) {
    const comments = await this.prismaService.comments.findMany({
      where: { inventoryId: inventoryId },
    })
    return comments
  }

  async update(id: string, updateCommentDto: UpdateCommentDto) {
    const comment = await this.prismaService.comments.findUnique({
      where: { id }
    })
    if (!comment) throw new NotFoundException("Comment not found")
    const updatedComment = await this.prismaService.comments.update({
      where: { id },
      data: updateCommentDto
    })
    return updatedComment
  }

  async remove(id: string) {
    const comment = await this.prismaService.comments.findUnique({
      where: { id }
    })
    if (!comment) throw new NotFoundException("Comment not found")
    await this.prismaService.comments.delete({
      where: { id }
    })
    return {
      success: true,
      message: "Comment deleted successfully!"
    }
  }
}
