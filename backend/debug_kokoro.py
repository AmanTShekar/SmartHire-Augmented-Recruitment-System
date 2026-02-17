import kokoro_onnx
import inspect
print("Kokoro-ONNX version:", getattr(kokoro_onnx, "__version__", "unknown"))
print("Kokoro members:", dir(kokoro_onnx.Kokoro))
try:
    print("Kokoro init signature:", inspect.signature(kokoro_onnx.Kokoro.__init__))
except:
    pass
print("Kokoro help:")
help(kokoro_onnx.Kokoro)
