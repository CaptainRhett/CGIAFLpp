import re
from collections import defaultdict

def parse_leak_blocks(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        content = f.read()
    
    # 按每个 `[leak]` 分割
    leak_blocks = content.split('[leak]')
    
    # 删除首段非泄漏内容
    leak_blocks = [block.strip() for block in leak_blocks if block.strip()]
    
    return leak_blocks

def extract_stack_trace(block, depth_limit=10):
    """提取前N层调用栈，默认前10层"""
    stack_lines = re.findall(r'#\d+\s+0x[\da-fA-F]+\s+-\s+in\s+(.*?)\s', block)
    return tuple(stack_lines[:depth_limit])  # 使用元组便于作为dict key

def classify_leaks(leak_blocks):
    stack_count = defaultdict(int)
    for block in leak_blocks:
        key = extract_stack_trace(block)
        if key:
            stack_count[key] += 1
    return stack_count

def main():
    file_path = '/home/wuhuang/fuzz/CGIAFLpp/asan_report_2025-05-12_19-37-27.txt'  # 替换为你的文件名
    leak_blocks = parse_leak_blocks(file_path)
    classified = classify_leaks(leak_blocks)
    
    print(f"共发现 {len(leak_blocks)} 条内存泄漏记录，分类统计如下：\n")
    for i, (stack, count) in enumerate(sorted(classified.items(), key=lambda x: -x[1]), 1):
        print(f"类别{i}: 出现次数 {count} 次")
        for func in stack:
            print(f"  - {func}")
        print()

if __name__ == '__main__':
    main()
