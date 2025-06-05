import os
import re
import csv
import matplotlib.pyplot as plt
from matplotlib.font_manager import FontProperties

# 使用 SimHei 字体（黑体）支持中文，或者指定系统中存在的中文字体
plt.rcParams['font.sans-serif'] = ['SimHei']  # 适用于大多数 Linux 和 Windows 系统
plt.rcParams['axes.unicode_minus'] = False    # 用于正常显示负号


def parse_memory_range(line):
    match = re.search(r'\[0x([0-9a-fA-F]+) - 0x([0-9a-fA-F]+)\]', line)
    if match:
        start = int(match.group(1), 16)
        end = int(match.group(2), 16)
        return end - start
    return 0

def analyze_file(file_path):
    a1 = a2 = b1 = b2 = b3 = 0
    run_time = 0.0

    with open(file_path, 'r', encoding='utf-8', errors='ignore') as f:
        lines = f.readlines()

        # 提取第一行时间
        if lines and "程序运行时间" in lines[0]:
            time_match = re.search(r'程序运行时间:\s*([\d.]+)\s*秒', lines[0])
            if time_match:
                run_time = float(time_match.group(1))

        for line in lines:
            if '[leak]' in line:
                size = parse_memory_range(line)
                b1 += size
                a1 += 1
            elif '[No Leak]' in line:
                size = parse_memory_range(line)
                b1 += size
                b2 += size
                a1 += 1
                a2 += 1

    a3 = a1 - a2
    b3 = b1 - b2

    return {
        'filename': os.path.basename(file_path),
        'a1_malloc_calls': a1,
        'a2_free_calls': a2,
        'a3_missing_frees': a3,
        'b1_alloc_bytes': b1,
        'b2_free_bytes': b2,
        'b3_leak_bytes': b3,
        'c_run_time_sec': run_time
    }

def analyze_folder(folder_path, output_csv='leak_analysis.csv'):
    results = []

    for filename in sorted(os.listdir(folder_path)):
        if filename.endswith(".txt"):
            file_path = os.path.join(folder_path, filename)
            stats = analyze_file(file_path)
            results.append(stats)

    # 写入CSV
    with open(output_csv, 'w', newline='') as csvfile:
        fieldnames = [
            'filename',
            'a1_malloc_calls',
            'a2_free_calls',
            'a3_missing_frees',
            'b1_alloc_bytes',
            'b2_free_bytes',
            'b3_leak_bytes',
            'c_run_time_sec'
        ]
        writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
        writer.writeheader()
        for row in results:
            writer.writerow(row)

    print(f"分析完成，结果已写入：{output_csv}")
    return results

def draw_bar_chart(results):
    filenames = [r['filename'] for r in results]
    a3_values = [r['a3_missing_frees'] for r in results]
    b3_values = [r['b3_leak_bytes'] for r in results]
    c_values = [r['c_run_time_sec'] for r in results]

    plt.figure(figsize=(18, 12))

    # 子图1：a3 未释放次数
    plt.subplot(3, 1, 1)
    plt.bar(filenames, a3_values, color='orange')
    plt.ylabel('a3 (Missing Free Count)')
    plt.title('未释放次数（a3）')
    plt.xticks(rotation=45, ha='right')

    # 子图2：b3 泄露字节数
    plt.subplot(3, 1, 2)
    plt.bar(filenames, b3_values, color='red')
    plt.ylabel('b3 (Leaked Bytes)')
    plt.title('泄露字节数（b3）')
    plt.xticks(rotation=45, ha='right')

    # 子图3：c 程序运行时间
    plt.subplot(3, 1, 3)
    plt.bar(filenames, c_values, color='green')
    plt.ylabel('c (Run Time in sec)')
    plt.title('程序运行时间（c）')
    plt.xticks(rotation=45, ha='right')

    plt.tight_layout()
    plt.savefig('leak_stats_split_comparison.png')
    plt.show()


if __name__ == "__main__":
    folder = input("请输入包含txt文件的文件夹路径：").strip()
    if os.path.isdir(folder):
        results = analyze_folder(folder)
        # draw_bar_chart(results)
    else:
        print("路径无效，请检查后再试。")
